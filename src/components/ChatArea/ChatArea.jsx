import api from "../../../axiosConfig";
import React, { useState, useEffect } from "react";
import MessageInput from "../MessageInput/MessageInput";

const ChatArea = ({ activeChat }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchOrCreatePrivateGroup = async () => {
      if (!activeChat) return;

      setLoading(true);
      try {
        // Gọi API tạo hoặc lấy nhóm 2 người
        const response = await api.post("/groups/create-private-group", {
          friendId: activeChat._id,
        }, { withCredentials: true });

        const group = response.data.group;

        // Sau khi có nhóm, có thể gọi tiếp API lấy tin nhắn theo group_id nếu bạn muốn
        // Ví dụ (giả sử bạn có API như /messages/:groupId):
        const messagesResponse = await api.get(`/messages/${group._id}`,{ withCredentials: true });
        setMessages(messagesResponse.data.messages);
      } catch (error) {
        console.error("Error fetching or creating private group:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreatePrivateGroup();
  }, [activeChat]);

  return (
    <div className="chat-area">
      {activeChat ? (
        <>
          <div className="chat-header">
            <h3>{activeChat.name}</h3>
          </div>
          <div className="chat-history">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${
                  msg.sender === "me" ? "sent" : "received"
                }`}
              >
                <span>{msg.content}</span>
              </div>
            ))}
          </div>
          <MessageInput
            onSend={(message) => {
              // Gửi tin nhắn, cập nhật UI, gửi tin nhắn đến backend qua socket hoặc API
              const newMessage = {
                id: Date.now(),
                sender: "me",
                content: message,
              };
              setMessages((prev) => [...prev, newMessage]);
            }}
          />
        </>
      ) : (
        <div className="no-chat-selected">
          <h3>Vui lòng chọn một cuộc trò chuyện</h3>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
