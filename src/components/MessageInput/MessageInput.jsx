// src/components/MessageInput.jsx
import React, { useState } from 'react';

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState('');
  
  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };
  
  return (
    <div className="message-input">
      <input 
         type="text" 
         placeholder="Nhập tin nhắn..."
         value={message}
         onChange={(e) => setMessage(e.target.value)}
         onKeyPress={e => { if (e.key === 'Enter') handleSend(); }}
      />
      <button onClick={handleSend}>Gửi</button>
      {/* Bạn có thể thêm nút gửi đa phương tiện như upload file, hình ảnh */}
    </div>
  );
};

export default MessageInput;
