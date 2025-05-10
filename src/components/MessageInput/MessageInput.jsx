import React, { useState } from 'react';
import "./messageInput.css";
import api from '../../../axiosConfig'
const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSend = async () => {
    // Gửi text (nếu có)
    if (message.trim()) {
      onSend({ type: 'text', content: message });
      setMessage('');
    }

     // Trường hợp gửi file (nếu có)
     if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const res = await api.post('/messages/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true, 
        });

        const { fileUrl, type } = res.data;

        onSend({ type: 'file', fileUrl: fileUrl, fileType: type });

        setSelectedFile(null);
      } catch (err) {
        console.error('Upload failed', err);
      }
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };
  
  return (
    <div className="message-input">
      <input
        className='message-input__text'
        type="text"
        placeholder="Nhập tin nhắn..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <input className='message-input__file' type="file" onChange={handleFileChange} />
      <button onClick={handleSend}>
        {selectedFile ? 'Gửi file' : 'Gửi'}
      </button>
    </div>
  );
};

export default MessageInput;
