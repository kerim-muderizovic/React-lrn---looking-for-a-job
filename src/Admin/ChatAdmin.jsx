import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { useAuth } from '../AuthContext';
import ChatWindow from '../chatWindows';
import './ChatAdmin.css';
import { useTranslation } from 'react-i18next';
import { createEchoInstance } from '../utils/pusherSetup';

const ChatAdmin = () => {
  const { t } = useTranslation();
  const { authUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    // Fetch all users the admin has chatted with
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/chat/users');
        
        setUsers(response.data.users || []);
        
        // Initialize unread counts
        const counts = {};
        if (response.data.unread_counts) {
          response.data.unread_counts.forEach(item => {
            counts[item.user_id] = item.count;
          });
        }
        setUnreadCounts(counts);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching chat users:', error);
        setIsLoading(false);
      }
    };

    fetchUsers();

    // Set up real-time listener for new messages
    const setupEcho = () => {
      const echo = createEchoInstance();

      // Listen for new messages on the admin's channel
      if (selectedUser) {
        echo.private(`chat.${authUser.user.id}.${selectedUser.id}`)
          .listen('MessageSent', (event) => {
            // Update unread count for the sender
            setUnreadCounts(prev => ({
              ...prev,
              [event.message.sender_id]: (prev[event.message.sender_id] || 0) + 1
            }));
            
            // Refresh user list if it's a new chat
            fetchUsers();
          });
      }

      return echo;
    };

    const echo = setupEcho();

    // Cleanup
    return () => {
      if (echo) {
        echo.disconnect();
      }
    };
  }, [authUser.user.id, selectedUser]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    
    // Mark messages as read when opening the chat
    if (unreadCounts[user.id] && unreadCounts[user.id] > 0) {
      axios.post(`/messages/mark-read/${user.id}`, {}, { withXSRFToken: true })
      .then(() => {
        // Update unread count for this user
        setUnreadCounts(prev => ({
          ...prev,
          [user.id]: 0
        }));
      })
      .catch(error => {
        console.error('Error marking messages as read:', error);
      });
    }
  };

  const closeChat = () => {
    setSelectedUser(null);
  };

  const refreshUnreadCounts = async () => {
    try {
      const response = await axios.get('/chat/unread-count');
      
      const counts = {};
      if (response.data && response.data.counts) {
        for (const count of response.data.counts) {
          counts[count.sender_id] = count.unread_count;
        }
      }
      
      setUnreadCounts(counts);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  return (
    <div className="chat-admin-container">
      <h1 className="chat-admin-title">{t('admin.chat')}</h1>
      
      <div className="chat-admin-content">
        <div className="chat-users-sidebar">
          <h2 className="chat-section-title">{t('admin.chatUsers')}</h2>
          
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>{t('admin.loading')}</p>
            </div>
          ) : (
            <div className="user-list">
              {users.length > 0 ? (
                users.map(user => (
                  <div 
                    key={user.id} 
                    className={`user-item ${selectedUser && selectedUser.id === user.id ? 'active' : ''}`}
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="user-avatar">
                      <img 
                        src={user.profile_image || "https://via.placeholder.com/40"} 
                        alt={user.name} 
                      />
                      {user.online && <span className="online-indicator"></span>}
                    </div>
                    <div className="user-info">
                      <span className="user-name">{user.name}</span>
                      <span className="last-message">{user.last_message || t('admin.noMessages')}</span>
                    </div>
                    {unreadCounts[user.id] > 0 && (
                      <span className="unread-badge">{unreadCounts[user.id]}</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-users-message">
                  <p>{t('admin.noChats')}</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="chat-main-area">
          {selectedUser ? (
            <ChatWindow 
              userId={authUser.user.id}
              receiverId={selectedUser.id}
              onClose={closeChat}
              onMessageRead={() => refreshUnreadCounts()}
            />
          ) : (
            <div className="select-user-prompt">
              <div className="prompt-icon">
                <i className="fas fa-comments"></i>
              </div>
              <h3>{t('admin.selectUserPrompt')}</h3>
              <p>{t('admin.selectUserDesc')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatAdmin; 