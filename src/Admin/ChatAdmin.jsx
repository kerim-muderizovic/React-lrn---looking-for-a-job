import React, { useState, useEffect, useRef } from 'react';
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
  const echoRef = useRef(null);

  // Fetch users function
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/chat/users');
  
      if (response.data.users) {
        setUsers(response.data.users);
        console.log(response.data.users, "Users");
        // Extract unread counts from users
        const counts = {};
        response.data.users.forEach(user => {
          counts[user.id] = user.unread_count;
        });
  
        setUnreadCounts(counts);
      } else {
        setUsers([]);
      }
  
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching chat users:', error);
      setIsLoading(false);
    }
  };

  // Setup Pusher when component mounts
  useEffect(() => {
    if (!authUser?.user?.id) return;
    
    // Track if cleanup is needed
    let cleanupNeeded = false;
    
    // Create Echo instance once
    if (!echoRef.current) {
      console.log("Creating new Echo instance for admin");
      echoRef.current = createEchoInstance();
      cleanupNeeded = true;
    }
    
    // Channel name for admin-specific messages
    const channelName = `chat.admin.${authUser.user.id}`;
    console.log(`Listening on ${channelName}`);
    
    // Check for existing channel and unbind if needed
    const existingChannel = echoRef.current.connector.channels[channelName];
    if (existingChannel) {
      existingChannel.unbind('MessageSent');
      console.log(`Unbound from existing admin channel: ${channelName}`);
    }
    
    // Listen for new messages on admin's channel
    const channel = echoRef.current.private(channelName);
    
    channel.listen('MessageSent', (event) => {
      console.log('New message received in admin channel:', event);
      
      // Update unread count for the sender without fetching all users
      setUnreadCounts(prev => ({
        ...prev,
        [event.sender_id]: (prev[event.sender_id] || 0) + 1
      }));
      
      // Update the user list locally without fetching
      setUsers(prevUsers => {
        // Find the user who sent the message
        const userIndex = prevUsers.findIndex(user => user.id === event.sender_id);
        
        if (userIndex === -1) {
          // If user not in list (rare case), don't modify
          return prevUsers;
        }
        
        // Create a new array to trigger render
        const newUsers = [...prevUsers];
        
        // Update the user's last message
        const messageObj = typeof event.message === 'string' 
          ? { message: event.message, time: event.timestamp }
          : { message: event.message.message, time: event.message.created_at };
        
        newUsers[userIndex] = {
          ...newUsers[userIndex],
          last_message: {
            message: messageObj.message,
            time: messageObj.time,
            is_from_admin: false
          },
          unread_count: (newUsers[userIndex].unread_count || 0) + 1
        };
        
        // Sort users to bring the one with new message to top
        return newUsers.sort((a, b) => {
          // If no last message, put at bottom
          if (!a.last_message) return 1;
          if (!b.last_message) return -1;
          
          // Compare times - newest first
          return new Date(b.last_message.time) - new Date(a.last_message.time);
        });
      });
    });

    // Listen for direct messages if a user is selected
    if (selectedUser) {
      const directChannelName = `chat.${authUser.user.id}.${selectedUser.id}`;
      console.log(`Also listening on direct admin-user channel: ${directChannelName}`);
      
      const existingDirectChannel = echoRef.current.connector.channels[directChannelName];
      if (existingDirectChannel) {
        existingDirectChannel.unbind('MessageSent');
        console.log(`Unbound existing listeners from ${directChannelName}`);
      }
      
      const directChannel = echoRef.current.private(directChannelName);
      
      directChannel.listen('MessageSent', (event) => {
        console.log(`New message received on direct admin-user channel ${directChannelName}:`, event);
        
        // If it's from the selected user, the ChatWindow component will handle displaying it
        if (event.sender_id === selectedUser.id) {
          console.log('Message from currently selected user, ChatWindow will handle display');
          
          // For admin-sent messages, update the users list
          if (event.sender_id === authUser.user.id) {
            // Update the user list locally without fetching
            setUsers(prevUsers => {
              // Find the user who will receive the message
              const userIndex = prevUsers.findIndex(user => user.id === selectedUser.id);
              
              if (userIndex === -1) return prevUsers;
              
              // Create a new array
              const newUsers = [...prevUsers];
              
              // Update the last message
              const messageObj = typeof event.message === 'string' 
                ? { message: event.message, time: event.timestamp }
                : { message: event.message.message, time: event.message.created_at };
              
              newUsers[userIndex] = {
                ...newUsers[userIndex],
                last_message: {
                  message: messageObj.message,
                  time: messageObj.time,
                  is_from_admin: true
                }
              };
              
              // Sort users to bring the one with new message to top
              return newUsers.sort((a, b) => {
                if (!a.last_message) return 1;
                if (!b.last_message) return -1;
                return new Date(b.last_message.time) - new Date(a.last_message.time);
              });
            });
          }
        }
      });
    }

    // Initial fetch - only do this once when component mounts
    fetchUsers();

    // Cleanup
    return () => {
      if (cleanupNeeded && echoRef.current) {
        // Unbind from admin channel
        const adminChannel = echoRef.current.connector.channels[channelName];
        if (adminChannel) {
          adminChannel.unbind('MessageSent');
          console.log(`Cleanup: Unbound from ${channelName}`);
        }
        
        // Unbind from direct channel if needed
        if (selectedUser) {
          const directChannelName = `chat.${authUser.user.id}.${selectedUser.id}`;
          const directChannel = echoRef.current.connector.channels[directChannelName];
          if (directChannel) {
            directChannel.unbind('MessageSent');
            console.log(`Cleanup: Unbound from ${directChannelName}`);
          }
        }
      }
    };
  }, [authUser?.user?.id, selectedUser]);

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
                      <span className="last-message">{user.last_message.message || t('admin.noMessages')}</span>
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