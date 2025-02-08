import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import './chat.css';
const Chat = ({ userId, adminId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch existing messages
    fetch(`http://localhost:8000/messages/${userId}/${adminId}`)
      .then((response) => response.json())
      .then((data) => setMessages(data));

    // Set up Pusher for real-time updates
    const pusher = new Pusher('1095a51e72cc082abbab', {
        cluster: 'eu',
        forceTLS: true,   // ✅ Ensure secure connection
        wsHost: 'localhost', // Change to your server if using Laravel WebSockets
        disableStats: true,
        enabledTransports: ['ws', 'wss'], // ✅ Enable WebSocket transports
      });
      

    const channel = pusher.subscribe(`chat.${userId}.${adminId}`);
    channel.bind('MessageSent', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      pusher.unsubscribe(`chat.${userId}.${adminId}`);
    };
  }, [userId, adminId]);

  const sendMessage = async () => {
    try {
        const response = await axios.post(
            'http://localhost:8000/send-message', // Corrected route
            {
                user_id: userId,
                admin_id: adminId,
                message: newMessage,
            }, 
            {
                withXSRFToken: true,  // ✅ Enable CSRF protection
                withCredentials: true,  // ✅ Allow credentials (cookies)
            }
        );

        console.log('Message sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};






  return (
    <div className='chatDiv'>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user_id === userId ? 'You' : 'Admin'}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;