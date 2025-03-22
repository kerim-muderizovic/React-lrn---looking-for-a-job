import React, { useState, useEffect, useRef } from 'react';
import axios from './axiosConfig';
import './chatWindows.css';
import { useTranslation } from 'react-i18next';
import { createEchoInstance } from './utils/pusherSetup';

const ChatWindow = ({ userId, receiverId, onClose, onMessageRead = () => {} }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [receiverInfo, setReceiverInfo] = useState({
    name: 'User',
    isOnline: false,
    profile_image: null
  });
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Fetch receiver info
    const fetchReceiverInfo = async () => {
      try {
        const response = await axios.get(`/user/${receiverId}`);
        
        if (response.data) {
          setReceiverInfo({
            name: response.data.name,
            profile_image: response.data.profile_image,
            isOnline: !!response.data.is_online
          });
        }
      } catch (error) {
        console.error('Error fetching receiver info:', error);
      }
    };

    // Fetch chat history when component mounts
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/messages/${userId}/${receiverId}`);
        
        if (response.data && Array.isArray(response.data.messages)) {
          setMessages(response.data.messages);
          
          // Mark messages as read
          if (response.data.unread_count > 0) {
            await axios.post(
              `/messages/mark-read/${receiverId}`, 
              {}, 
              { withXSRFToken: true }
            );
            onMessageRead();
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceiverInfo();
    fetchMessages();

    // Set up Pusher with Laravel Echo for real-time updates
    const echo = createEchoInstance();

    // Subscribe to the private channel for this chat
    const channel = echo.private(`chat.${userId}.${receiverId}`)
      .listen('MessageSent', (event) => {
        // Add the new message to the state when it's received
        setMessages(prevMessages => [...prevMessages, event.message]);
        
        // Mark messages as read if the chat window is open
        axios.post(
          `/messages/mark-read/${receiverId}`, 
          {}, 
          { withXSRFToken: true }
        ).then(() => {
          onMessageRead();
        });
      });

    // Clean up the echo instance when the component unmounts
    return () => {
      channel.unsubscribe();
      echo.disconnect();
    };
  }, [receiverId, userId, onMessageRead]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (newMessage.trim()) {
      axios.post(
        '/send-message',
        { 
          receiver_id: receiverId, 
          message: newMessage 
        },
        { withXSRFToken: true }
      )
      .then((response) => {
        if (response.data && response.data.message) {
          setMessages(prevMessages => [...prevMessages, response.data.message]);
        }
        setNewMessage('');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="receiver-info">
          {receiverInfo.profile_image ? (
            <img 
              src={receiverInfo.profile_image} 
              alt={receiverInfo.name} 
              className="receiver-avatar"
            />
          ) : (
            <div className="receiver-avatar-placeholder">
              {receiverInfo.name.charAt(0)}
            </div>
          )}
          <div className="receiver-details">
            <h5 className="receiver-name">{receiverInfo.name}</h5>
            <span className={`status-indicator ${receiverInfo.isOnline ? 'online' : 'offline'}`}>
              {receiverInfo.isOnline ? t('chat.online') : t('chat.offline')}
            </span>
          </div>
        </div>
        <button className="close-chat-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="chat-messages">
        {isLoading ? (
          <div className="chat-loading">
            <div className="spinner"></div>
            <p>{t('chat.loading')}</p>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender_id === userId ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                {msg.message}
                <span className="message-time">{formatMessageTime(msg.created_at)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-messages">
            <p>{t('chat.noMessages')}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={t('chat.typeMessage')}
          className="chat-input"
        />
        <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
