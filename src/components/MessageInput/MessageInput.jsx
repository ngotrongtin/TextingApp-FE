import React, { useState } from "react";
import "./messageInput.css";
import api from "../../../axiosConfig";
import EmojiPicker from "emoji-picker-react";
const MessageInput = ({ onSend, scrollToBottom }) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  const handleSend = async () => {
    let hasSent = false;
    // Gửi text (nếu có)
    if (message.trim()) {
      onSend({ type: "text", content: message });
      setMessage("");
      hasSent = true;
    }

    // Trường hợp gửi file (nếu có)
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await api.post("/messages/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        const { fileUrl, type } = res.data;

        onSend({ type: "file", fileUrl: fileUrl, fileType: type });

        setSelectedFile(null);

        hasSent = true;
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
    // Gửi xong thì cuộn xuống
    if (hasSent && scrollToBottom) {
      setTimeout(() => scrollToBottom(), 100); // delay nhẹ để đợi render
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  return (
    <div className="message-input">
      {/* Phần hiển thị file đã chọn */}
      {selectedFile && (
        <div className="message-input__file-info">
          <span className="message-input__file-name">{selectedFile.name}</span>
          <button
            className="message-input__file-remove"
            onClick={() => setSelectedFile(null)}
            title="Xoá file"
          >
            ❌
          </button>
        </div>
      )}

      <div className="message-input__main">
        <button
          className="message-input__emoji-button"
          onClick={() => setShowEmojiPicker(prev => !prev)}
          title="Chọn emoji"
        >
          😀
        </button>
        <input
          className="message-input__text"
          type="text"
          placeholder="Nhập tin nhắn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <label htmlFor="file-upload" className="message-input__file-label">
          📎
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*,video/*,audio/*,application/pdf"
          name="file"
          className="message-input__file"
          onChange={handleFileChange}
        />

        <button onClick={handleSend}>
          {selectedFile ? "Gửi file" : "Gửi"}
        </button>

        {showEmojiPicker && (
        <div className="emoji-picker-container">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      </div>
    </div>
  );
};

export default MessageInput;
