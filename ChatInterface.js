import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your backend URL

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [picture, setPicture] = useState(null);

  // Set up event listeners for receiving messages and pictures
  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, { type: 'message', content: data.message, senderId: data.senderId }]);
    });

    socket.on('receivePicture', (data) => {
      setMessages((prevMessages) => [...prevMessages, { type: 'picture', content: data.picture, senderId: data.senderId }]);
    });

    // Handle disconnection and auto-reconnect
    const handleDisconnect = () => {
      // Logic to handle disconnection
      // ...
      // Set up auto-reconnect after 5 seconds
      setTimeout(() => {
        // Implement the logic to auto-reconnect to a new chat partner
        // ...
        // Clear the chat interface and initiate a new chat room connection
        setMessages([]);
        // ...
      }, 5000); // Reconnect after 5 seconds (adjust the time as needed)
    };

    // Detect disconnection
    socket.on('disconnect', handleDisconnect);

    return () => {
      // Clean up: Remove the event listeners when the component unmounts
      socket.off('receiveMessage');
      socket.off('receivePicture');
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  const handleSendMessage = () => {
    if (messageText.trim() !== '') {
      // Send the message to the chat partner
      socket.emit('sendMessage', messageText, 'RECEIVER_USER_ID');
      setMessages((prevMessages) => [...prevMessages, { type: 'message', content: messageText, senderId: 'SENDER_USER_ID' }]);
      setMessageText('');
    }
  };

  const handleSendPicture = () => {
    if (picture) {
      // Send the picture to the chat partner
      const formData = new FormData();
      formData.append('picture', picture);
      // Send the picture to the backend
      // Implement the API endpoint for sending pictures on the backend
      fetch('http://localhost:3000/api/sendPicture', {
        method: 'POST',
        body: formData,
      });
      setMessages((prevMessages) => [...prevMessages, { type: 'picture', content: URL.createObjectURL(picture), senderId: 'SENDER_USER_ID' }]);
      setPicture(null);
    }
  };

  const handleCloseChatRoom = () => {
    // Close the current chat room
    socket.emit('closeChatRoom');
    // Implement the logic to clear the chat interface and disconnect from the current chat partner
    setMessages([]);
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.senderId === 'SENDER_USER_ID' ? 'sent' : 'received'}`}>
            {message.type === 'message' ? <p>{message.content}</p> : <img src={URL.createObjectURL(new Blob([message.content]))} alt="Received Picture" />}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
        <button onClick={handleSendMessage}>Send Message</button>
        <input type="file" accept="image/*" onChange={(e) => setPicture(e.target.files[0])} />
        <button onClick={handleSendPicture}>Send Picture</button>
      </div>
      <div className="chat-actions">
        <button onClick={handleCloseChatRoom}>Close Chat Room</button>
      </div>
    </div>
  );
};

export default ChatInterface;
