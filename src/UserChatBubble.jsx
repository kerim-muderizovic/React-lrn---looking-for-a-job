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
  const echoRef = useRef(null);

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
    if (!authUser?.isLoggedIn || !authUser?.user?.id) return;

    // Setup function to configure Echo listeners
    const setupEchoListeners = () => {
      // Create Echo instance once
      if (!echoRef.current) {
        console.log("Creating Echo instance for user chat");
        echoRef.current = createEchoInstance();
      }
  
      // Channel name for user-specific channel
      const channelName = `chat.user.${authUser.user.id}`;
      console.log(`Setting up listener on ${channelName}`);
      
      // Clean up any existing listeners to prevent duplicates
      const existingChannel = echoRef.current.connector.channels[channelName];
      if (existingChannel) {
        existingChannel.unbind('MessageSent');
        console.log(`Unbound existing listeners from ${channelName}`);
      }
      
      // Listen for new messages on the user channel
      const channel = echoRef.current.private(channelName);
      
      channel.listen('MessageSent', (event) => {
        console.log('New message received in user chat:', event);
        
        // If this chat is open with the sender admin, add the message
        if (selectedAdmin && event.sender_id === selectedAdmin.id) {
          console.log('Adding new message to chat window from admin', selectedAdmin.id);
          
          // Add the new message to state if it's not a duplicate
          setMessages(prevMessages => {
            // Construct the message object based on what we receive
            const messageObj = typeof event.message === 'string' 
              ? {
                  id: 'server-' + Date.now(),
                  sender_id: event.sender_id,
                  receiver_id: event.receiver_id,
                  message: event.message,
                  is_read: false,
                  created_at: event.timestamp,
                  updated_at: event.timestamp
                }
              : event.message;
              
            // Check if this message is already in the list
            const isDuplicate = prevMessages.some(msg => 
              (msg.id && msg.id === messageObj.id) || 
              (msg.message === messageObj.message && 
               msg.sender_id === event.sender_id &&
               // Compare timestamps within 2 seconds to account for slight variations
               Math.abs(new Date(msg.created_at || Date.now()) - new Date(messageObj.created_at || event.timestamp || Date.now())) < 2000));
               
            if (isDuplicate) {
              console.log('Duplicate message detected, not adding to UI');
              return prevMessages;
            }
            
            console.log('Adding new message from event to UI:', messageObj);
            return [...prevMessages, messageObj];
          });
          
          // Mark as read automatically since chat is open
          axios.post(`/messages/mark-read/${selectedAdmin.id}`, {}, { withXSRFToken: true })
            .then(() => {
              console.log('Marked message as read');
              setUnreadCount(prev => Math.max(0, prev - 1)); // Decrement unread count
            })
            .catch(error => {
              console.error('Error marking message as read:', error);
            });
        } else {
          // Otherwise just update the unread count
          console.log('Updating unread count');
          setUnreadCount(prev => prev + 1);
        }
      });
  
      // If an admin is selected, also listen for direct messages
      let directChannelName = null;
      if (selectedAdmin) {
        directChannelName = `chat.${authUser.user.id}.${selectedAdmin.id}`;
        console.log(`Also setting up listener on direct channel: ${directChannelName}`);
        
        const existingDirectChannel = echoRef.current.connector.channels[directChannelName];
        if (existingDirectChannel) {
          existingDirectChannel.unbind('MessageSent');
          console.log(`Unbound existing listeners from ${directChannelName}`);
        }
        
        const directChannel = echoRef.current.private(directChannelName);
        
        directChannel.listen('MessageSent', (event) => {
          console.log(`New message received on direct channel ${directChannelName}:`, event);
          
          // Only process if it's from the selected admin (to avoid duplicates)
          if (event.sender_id === selectedAdmin.id) {
            // Add the new message to state
            setMessages(prevMessages => {
              // Construct the message object based on what we receive
              const messageObj = typeof event.message === 'string' 
                ? {
                    id: 'server-' + Date.now(),
                    sender_id: event.sender_id,
                    receiver_id: event.receiver_id,
                    message: event.message,
                    is_read: false,
                    created_at: event.timestamp,
                    updated_at: event.timestamp
                  }
                : event.message;
                
              // Check if this message is already in the list
              const isDuplicate = prevMessages.some(msg => 
                (msg.id && msg.id === messageObj.id) || 
                (msg.message === messageObj.message && 
                 msg.sender_id === event.sender_id &&
                 // Compare timestamps within 2 seconds to account for slight variations
                 Math.abs(new Date(msg.created_at || Date.now()) - new Date(messageObj.created_at || event.timestamp || Date.now())) < 2000));
                 
              if (isDuplicate) {
                console.log('Duplicate direct message detected, not adding to UI');
                return prevMessages;
              }
              
              console.log('Adding new direct message from event to UI:', messageObj);
              return [...prevMessages, messageObj];
            });
          }
        });
      }
      
      return { userChannel: channelName, directChannel: directChannelName };
    };
    
    // Set up the listeners and get channel names for cleanup
    const channels = setupEchoListeners();
  
    // Cleanup function
    return () => {
      if (echoRef.current) {
        // Unbind from user channel
        if (channels.userChannel) {
          const userChannel = echoRef.current.connector.channels[channels.userChannel];
          if (userChannel) {
            userChannel.unbind('MessageSent');
            console.log(`Cleanup: Unbound from ${channels.userChannel}`);
          }
        }
        
        // Unbind from direct channel if it exists
        if (channels.directChannel) {
          const directChannel = echoRef.current.connector.channels[channels.directChannel];
          if (directChannel) {
            directChannel.unbind('MessageSent');
            console.log(`Cleanup: Unbound from ${channels.directChannel}`);
          }
        }
      }
    };
  }, [authUser?.isLoggedIn, authUser?.user?.id, selectedAdmin]);

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
    
    if (!selectedAdmin || !newMessage.trim() || !authUser?.isLoggedIn) {
      console.error('Cannot send message: missing admin, message, or not logged in');
      return;
    }
    
    const messageText = newMessage.trim();
    // Clear input immediately for better UX
    setNewMessage('');
    
    // Create a temporary optimistic message to display immediately
    const optimisticMessage = {
      id: 'temp-' + Date.now(), // Temporary ID
      sender_id: authUser.user.id,
      receiver_id: selectedAdmin.id,
      message: messageText,
      is_read: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add the optimistic message to the UI immediately
    setMessages(prevMessages => [...prevMessages, optimisticMessage]);
    
    try {
      // First ensure we have a valid CSRF token
      await axios.get('/sanctum/csrf-cookie');
      
      // Then send the message with proper authentication
      const response = await axios.post(
        '/send-message',
        {
          receiver_id: selectedAdmin.id,
          message: messageText
        },
        { 
          withCredentials: true,
          withXSRFToken: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );
      
      if (response.data && response.data.message) {
        // Replace the temporary message with the real one from server
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === optimisticMessage.id ? response.data.message : msg
          )
        );
        
        console.log('Message sent successfully', response.data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Log specific details about the error for debugging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      
      // If error, remove the optimistic message and restore the input
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== optimisticMessage.id)
      );
      setNewMessage(messageText);
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
                  disabled={!newMessage.trim()}
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