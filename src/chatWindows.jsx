import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const ChatWindow = ({ userId, receiverId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOnline, setIsOnline] = useState(false);  // Update with actual online status

  useEffect(() => {
    // Fetch chat history when component mounts
    axios
      .get(`http://localhost:8000/api/messages?receiver_id=${receiverId}`)
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });

    // Set up Pusher with Laravel Echo for real-time updates
    const echo = new Echo({
      broadcaster: 'pusher',
      key: '696ce06a3e8654eadc7f',  // Your Pusher key
      cluster: 'eu',  // Your Pusher cluster
      forceTLS: true,
      disableStats: true,
      withCredentials: true,
      withXsrfToken: true,
      authEndpoint: 'http://localhost:8000/broadcasting/auth',  // Auth endpoint for Laravel broadcasting
      auth: {
        headers: {
          withCredentials: true,
          withXsrfToken: true,
        },
      },
    });

    // Subscribe to the private channel for this chat
    const channel = echo.private(`chat.${receiverId}.${userId}`)
      .listen('MessageSent', (event) => {
        // Add the new message to the state when it's received
        setMessages((prevMessages) => [...prevMessages, event.message]);
      });

    // Clean up the echo instance when the component unmounts
    return () => {
      channel.unsubscribe();
      echo.disconnect();
    };
  }, [receiverId, userId]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (newMessage.trim()) {
      axios
        .post(
          'http://localhost:8000/api/messages',
          { receiver_id: receiverId, message: newMessage },
          { withCredentials: true }  // Ensure cookies are sent with the request
        )
        .then((response) => {
          setMessages((prevMessages) => [...prevMessages, response.data]);
          setNewMessage('');
        })
        .catch((error) => {
          console.error('Error sending message:', error);
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
          <div
            key={msg.id}
            className={`message ${msg.sender_id === userId ? 'sent' : 'received'}`}
          >
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
