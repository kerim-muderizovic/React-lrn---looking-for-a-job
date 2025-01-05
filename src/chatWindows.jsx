import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const ChatWindow = ({ userId, receiverId, onClose }) => {
      const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // Control chat window visibility

  useEffect(() => {
    // Fetch chat history
    axios.get(`http://localhost:8000/api/messages?receiver_id=${receiverId}`).then(response => {
      setMessages(response.data);
    });

    // Listen for new messages
   const echo = new Echo({
  broadcaster: 'pusher',
  key: '696ce06a3e8654eadc7f',
  cluster: 'eu',
  forceTLS: true,
  wsHost: 'localhost',  // Explicitly set the WebSocket host to backend's localhost
//   wsPort: 6001,         // WebSocket server port
//   wssPort: 6001,        // Secure WebSocket port if using wss
  disableStats: true,
  withCredentials: true,
  withXSRFToken:true,
  authEndpoint:'http://localhost:8000/broadcasting1/auth',  // Ensures credentials are sent with requests
  auth: {
    headers: {
        withCredentials: true,
        withXSRFToken:true, // CSRF token if you're using Laravel's CSRF protection
    },
    method: 'POST', // Force POST explicitly
    endpoint: 'http://localhost:8000/broadcasting/auth',  // Custom broadcasting auth URL
  },
 
});


    echo.private(`chat.${receiverId}.${userId}`)
        .listen('MessageSent', (event) => {
          setMessages((prev) => [...prev, event.message]);
        });

    return () => echo.disconnect();
  }, [receiverId, userId]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (newMessage.trim()) {
        axios.post(
            'http://localhost:8000/api/messages',
            {
              receiver_id: receiverId,
              message: newMessage,
            },
            {
              withCredentials: true,
              withXSRFToken:true, // Enables sending cookies for cross-origin requests
            }
          )
          .then(response => {
            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
          })
          .catch(error => {
            console.error("Error sending message:", error);
          });
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h5>Chat with {isOnline ? 'Online' : 'Offline'}</h5>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender_id === userId ? 'sent' : 'received'}`}>
            {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
