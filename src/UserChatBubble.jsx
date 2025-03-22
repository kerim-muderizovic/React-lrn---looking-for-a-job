import React, { useState, useEffect, useRef } from 'react';
import axios from './axiosConfig';
import { createEchoInstance } from './utils/pusherSetup';
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';
import './UserChatBubble.css';

const UserChatBubble = () => {
  const { t } = useTranslation();
  const { authUser } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  // Handle click outside to close chat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target) && isChatOpen) {
        setIsChatOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChatOpen]);

  // Fetch admins when component mounts
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/admins');
        
        if (response.data && response.data.admins) {
          setAdmins(response.data.admins);
          
          // If only one admin, auto-select them
          if (response.data.admins.length === 1) {
            setSelectedAdmin(response.data.admins[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (authUser?.isLoggedIn) {
      fetchAdmins();
      fetchUnreadCount();
    }
  }, [authUser?.isLoggedIn]);

  // Set up real-time listener for new messages
  useEffect(() => {
    if (!authUser?.isLoggedIn) return;

    const setupEcho = () => {
      const echo = createEchoInstance();

      // Listen for new messages
      if (authUser?.user?.id) {
        echo.private(`chat.user.${authUser.user.id}`)
          .listen('NewMessage', (event) => {
            // Add the new message to state
            setMessages(prevMessages => [...prevMessages, event.message]);
            
            // Update unread count if chat is closed
            if (!isChatOpen) {
              setUnreadCount(prev => prev + 1);
            }
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
  }, [authUser?.isLoggedIn, authUser?.user?.id, isChatOpen]);

  // Fetch messages when selectedAdmin changes or chat opens
  useEffect(() => {
    if (isChatOpen && selectedAdmin && authUser?.isLoggedIn) {
      fetchMessages();
    }
  }, [selectedAdmin, isChatOpen]);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('/chat/unread-count');
      
      if (response.data && response.data.count) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/messages/${authUser.user.id}/${selectedAdmin.id}`
      );
      
      if (response.data && Array.isArray(response.data.messages)) {
        setMessages(response.data.messages);
        
        // Mark messages as read
        if (response.data.unread_count > 0) {
          await axios.post(
            `/messages/mark-read/${selectedAdmin.id}`,
            {},
            { withXSRFToken: true }
          );
          setUnreadCount(0);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    
    // If opening chat, mark messages as read
    if (!isChatOpen && selectedAdmin) {
      fetchMessages();
    }
  };

  const handleSelectAdmin = (admin) => {
    setSelectedAdmin(admin);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!selectedAdmin || !newMessage.trim()) return;
    
    try {
      const response = await axios.post(
        '/send-message',
        {
          receiver_id: selectedAdmin.id,
          message: newMessage.trim()
        },
        { withXSRFToken: true }
      );
      
      if (response.data && response.data.message) {
        setMessages(prevMessages => [...prevMessages, response.data.message]);
      }
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="user-chat-container" ref={chatRef}>
      {/* Chat bubble */}
      <button 
        className="chat-bubble" 
        onClick={toggleChat}
        aria-label={t('chat.openChat')}
      >
        <i className="fas fa-comments"></i>
        {unreadCount > 0 && (
          <span className="unread-count">{unreadCount}</span>
        )}
      </button>

      {/* Chat window */}
      {isChatOpen && (
        <div className="user-chat-window">
          <div className="user-chat-header">
            <h3>{t('chat.contactAdmin')}</h3>
            <button className="close-chat" onClick={toggleChat}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          {admins.length > 1 && !selectedAdmin ? (
            <div className="admin-selection">
              <p>{t('chat.selectAdmin')}</p>
              <div className="admin-list">
                {admins.map(admin => (
                  <div 
                    key={admin.id}
                    className="admin-item"
                    onClick={() => handleSelectAdmin(admin)}
                  >
                    <div className="admin-avatar">
                      {admin.profile_image ? (
                        <img src={admin.profile_image} alt={admin.name} />
                      ) : (
                        <div className="admin-avatar-placeholder">
                          {admin.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="admin-info">
                      <span className="admin-name">{admin.name}</span>
                      <span className="admin-role">{t('admin.panel')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {selectedAdmin && (
                <div className="selected-admin">
                  <div className="admin-avatar">
                    {selectedAdmin.profile_image ? (
                      <img src={selectedAdmin.profile_image} alt={selectedAdmin.name} />
                    ) : (
                      <div className="admin-avatar-placeholder">
                        {selectedAdmin.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="admin-info">
                    <span className="admin-name">{selectedAdmin.name}</span>
                    <span className="admin-status">
                      {selectedAdmin.online ? t('chat.online') : t('chat.offline')}
                    </span>
                  </div>
                </div>
              )}

              <div className="user-chat-messages">
                {isLoading ? (
                  <div className="chat-loading">
                    <div className="spinner"></div>
                    <p>{t('chat.loading')}</p>
                  </div>
                ) : messages.length > 0 ? (
                  <>
                    {messages.map(message => (
                      <div 
                        key={message.id}
                        className={`chat-message ${message.sender_id === authUser.user.id ? 'sent' : 'received'}`}
                      >
                        <div className="message-content">
                          {message.message}
                          <span className="message-time">
                            {formatMessageTime(message.created_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="no-messages">
                    <p>{t('chat.noMessages')}</p>
                  </div>
                )}
              </div>

              <form className="chat-input-form" onSubmit={sendMessage}>
                <input 
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('chat.typeMessage')}
                  className="chat-input"
                />
                <button 
                  type="submit" 
                  className="send-button"
                  disabled={!newMessage.trim() || !selectedAdmin}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserChatBubble; 