import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Chat({ userId, otherUserId }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (userId && otherUserId) {
      axios.get(`/api/chat/conversation/${userId}/${otherUserId}`)
        .then(res => setMessages(res.data));
    }
  }, [userId, otherUserId]);

  const sendMessage = async () => {
    if (!content.trim()) return;
    await axios.post('/api/chat/send', { sender: userId, receiver: otherUserId, content });
    setContent('');
    // Refresh messages
    axios.get(`/api/chat/conversation/${userId}/${otherUserId}`)
      .then(res => setMessages(res.data));
  };

  return (
    <div>
      <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #ccc', padding: 10 }}>
        {messages.map(msg => (
          <div key={msg._id} style={{ margin: '5px 0' }}>
            <b>{msg.sender === userId ? 'You' : 'Them'}:</b> {msg.content}
          </div>
        ))}
      </div>
      <input
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Type your message"
        style={{ width: '80%' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;