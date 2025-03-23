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
  const echoRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages function for reuse
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/messages/${userId}/${receiverId}`);
      
      if (response.data && Array.isArray(response.data.messages)) {
        console.log('Fetched messages:', response.data.messages.length);
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

  // Separate useEffect for initial data loading
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

    console.log(`Loading initial data for chat between ${userId} and ${receiverId}`);
    fetchReceiverInfo();
    fetchMessages();
  }, [userId, receiverId]); // Only run this when users change

  // Separate useEffect for Echo setup
  useEffect(() => {
    // Set up Echo instance only once
    const setupEcho = () => {
      if (!echoRef.current) {
        console.log('Creating new Echo instance for chat window');
        echoRef.current = createEchoInstance();
      }
      
      // The channel we want to listen to
      const channelName = `chat.${userId}.${receiverId}`;
      console.log(`Setting up channel: ${channelName}`);
      
      // Check if we're already listening to this channel
      const existingChannel = echoRef.current.connector.channels[channelName];
      if (existingChannel) {
        // Unbind existing listener to prevent duplicates
        existingChannel.unbind('MessageSent');
        console.log(`Unbound existing listener from ${channelName}`);
      }
      
      // Subscribe to the private channel for this chat
      const channel = echoRef.current.private(channelName);
      
      // Listen for new messages
      channel.listen('MessageSent', (event) => {
        console.log(`Received real-time message on ${channelName}:`, event);
        
        // Safely update messages state to prevent duplicates
        setMessages(prevMessages => {
          // Don't add the message if it's from the current user (already handled by optimistic updates)
          if (event.sender_id === userId) {
            console.log('Ignoring own message from websocket');
            return prevMessages;
          }
          
          // Construct a proper message object if only partial data is received
          const newMessage = typeof event.message === 'string' 
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
          
          // Check if this is a duplicate message
          const isDuplicate = prevMessages.some(msg => 
            (msg.id && newMessage.id && msg.id === newMessage.id) || 
            (msg.message === newMessage.message && 
             msg.sender_id === event.sender_id && 
             // Compare timestamps within 2 seconds to account for slight variations
             Math.abs(new Date(msg.created_at || Date.now()) - new Date(newMessage.created_at || event.timestamp || Date.now())) < 2000));
          
          if (isDuplicate) {
            console.log('Duplicate message detected, not adding to UI');
            return prevMessages;
          }
                
          console.log('Adding new message from event to UI:', newMessage);
          return [...prevMessages, newMessage];
        });
        
        // Mark messages as read since the chat window is open
        axios.post(
          `/messages/mark-read/${receiverId}`, 
          {}, 
          { withXSRFToken: true }
        ).then(() => {
          onMessageRead();
        });
      });
      
      return channelName;
    };
    
    const channelName = setupEcho();

    // Clean up the subscription when the component unmounts or userId/receiverId changes
    return () => {
      if (echoRef.current) {
        const existingChannel = echoRef.current.connector.channels[channelName];
        if (existingChannel) {
          existingChannel.unbind('MessageSent');
          console.log(`Cleanup: Unbound from channel ${channelName}`);
        }
      }
    };
  }, [receiverId, userId, onMessageRead]); // Only recreate when these dependencies change

  const sendMessage = (e) => {
    e.preventDefault();

    if (newMessage.trim()) {
      const messageText = newMessage.trim();
      setNewMessage(''); // Clear input immediately for better UX
      
      // Create a temporary optimistic message to display immediately
      const optimisticMessage = {
        id: 'temp-' + Date.now(), // Temporary ID
        sender_id: userId,
        receiver_id: receiverId,
        message: messageText,
        is_read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add the optimistic message to the UI immediately
      setMessages(prevMessages => [...prevMessages, optimisticMessage]);
      
      // Send to server
      axios.post(
        '/send-message',
        { 
          receiver_id: receiverId, 
          message: messageText 
        },
        { withXSRFToken: true }
      )
      .then((response) => {
        if (response.data && response.data.message) {
          // Replace the temporary message with the real one from server
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === optimisticMessage.id ? response.data.message : msg
            )
          );
          
          // Log successful send
          console.log('Message sent successfully', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        // If error, remove the optimistic message and restore the input
        setMessages(prevMessages => 
          prevMessages.filter(msg => msg.id !== optimisticMessage.id)
        );
        setNewMessage(messageText);
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
