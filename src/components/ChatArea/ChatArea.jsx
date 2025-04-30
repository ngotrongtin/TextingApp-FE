import api from "../../../axiosConfig";
import React, { useState, useEffect } from "react";
import MessageInput from "../MessageInput/MessageInput";
import { socket } from "../../socket/index";
import { useAuth } from "../../hooks/useAuth";
import "./chatarea.css";

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);

  const day = date.getDate().toString().padStart(2, "0");       // Ngày
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng (JavaScript đếm tháng từ 0)
  const year = date.getFullYear().toString().slice(-2);           // Hai số cuối của năm

  const hours = date.getHours().toString().padStart(2, "0");     // Giờ
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Phút

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const ChatArea = ({ activeChat }) => {
  const [messages, setMessages] = useState([]);
  const [groupId, setGroupId] = useState(null);
  const { user, loading: userLoading } = useAuth();
  const [messagesLoading, setMessagesLoading] = useState(false);
  
  
  useEffect(() => {
    let prevGroupId = groupId;

    const fetchOrCreatePrivateGroup = async () => {
      if (!activeChat) return;

      if (prevGroupId) {
        socket.emit("leaveRoom", groupId);
        console.log("Leaving room:", prevGroupId);
      }

      setMessagesLoading(true);
      try {
        // Gọi API tạo hoặc lấy nhóm 2 người
        const response = await api.post(
          "/groups/create-private-group",
          {
            friendId: activeChat._id,
          },
          { withCredentials: true }
        );

        const group = response.data.group;

        setGroupId(group._id); // Lưu groupId để sử dụng sau này

        console.log("Group ID:", group._id);
        // Tham gia phòng socket
        socket.emit("joinRoom", group._id);

        // Sau khi có nhóm, có thể gọi tiếp API lấy tin nhắn theo group_id nếu bạn muốn
        // Ví dụ (giả sử bạn có API như /messages/:groupId):
        const messagesResponse = await api.get(`/messages/${group._id}`, {
          withCredentials: true,
        });
        setMessages(messagesResponse.data.messages);
      } catch (error) {
        console.error("Error fetching or creating private group:", error);
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchOrCreatePrivateGroup();
  }, [activeChat]);

  useEffect(() => {
    // Lắng nghe tin nhắn mới
    const handleNewMessage = (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("newMessage", handleNewMessage);

    // Dọn sự kiện khi unmount
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  const handleSend = (messageText) => {
    if (!groupId || !messageText.trim()) return;

    if (!user._id) {
      alert("Không có userId!");
      return;
    }
    const newMessage = {
      group_id: groupId,
      sender_id: user._id,
      content: messageText,
      message_type: "text",
    };

    // Gửi qua socket
    socket.emit("sendMessage", newMessage);

    // Option: bạn có thể push tạm thời luôn để cảm giác nhanh
    // hoặc chỉ chờ socket server gửi về "newMessage"
  };

  if (userLoading) return <p>Đang tải người dùng...</p>;
  if (!user) return <p>Vui lòng đăng nhập để sử dụng tính năng này.</p>;

  if (!activeChat) {
    return (
      <div className="no-chat-selected">
        <h3>Vui lòng chọn một cuộc trò chuyện</h3>
      </div>
    );
  }

  return (
    <div className="chat-area">
      <div className="chat-header">
        <h3>{activeChat.username}</h3>
      </div>
      <div className="chat-history">
        {messagesLoading ? (
          <p>Đang tải...</p>
        ) : (
          messages.map((msg) => {
            const isMe =
              (msg.sender_id?._id || msg.sender_id) === user._id;
            return (
              <div
                key={msg._id}
                className={`message-wrapper ${isMe ? "sent" : "received"}`}
              >
                <div className="message-bubble">
                  <span>{msg.content}</span>
                  <div className="message-time">
                    {formatTime(msg.created_at)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default ChatArea;
