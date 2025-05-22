import api from "../../../axiosConfig";
import React, { useState, useEffect, useRef } from "react";
import MessageInput from "../MessageInput/MessageInput";
import { socket } from "../../socket/index";
import { useAuth, useActiveChat } from "../../hooks/useAuth";
import "./chatarea.css";

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);

  const day = date.getDate().toString().padStart(2, "0"); // Ngày
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng (JavaScript đếm tháng từ 0)
  const year = date.getFullYear().toString().slice(-2); // Hai số cuối của năm

  const hours = date.getHours().toString().padStart(2, "0"); // Giờ
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Phút

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const ChatArea = ({ onActiveFeature }) => {
  const { active } = useActiveChat();
  const [messages, setMessages] = useState([]);
  const [groupId, setGroupId] = useState(null);
  const { user, loading: userLoading } = useAuth();
  const [messagesLoading, setMessagesLoading] = useState(false);
  //
  const bottomRef = useRef();

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    let prevGroupId = groupId;

    const fetchGroup = async () => {
      if (!active) return;

      if (prevGroupId) {
        socket.emit("leaveRoom", groupId);
        console.log("Leaving room:", prevGroupId);
      }

      setMessagesLoading(true);
      try {
        const currentGroup = active;
        setGroupId(currentGroup._id); // Lưu groupId để sử dụng sau này

        //console.log("Group ID:", currentGroup._id);
        // Tham gia phòng socket
        socket.emit("joinRoom", currentGroup._id);

        // Sau khi có nhóm, có thể gọi tiếp API lấy tin nhắn theo group_id
        const messagesResponse = await api.get(
          `/messages/${currentGroup._id}`,
          {
            withCredentials: true,
          }
        );
        setMessages(messagesResponse.data.messages);
      } catch (error) {
        console.error("Error fetching or creating private group:", error);
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchGroup();
  }, [active]);

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

  const handleSend = (messageInfo) => {
    if (!groupId) return;

    if (!user._id) {
      alert("Không có userId!");
      return;
    }

    if (!messageInfo) {
      alert("Không có nội dung tin nhắn!");
      return;
    }

    let newMessage = null;
    if (messageInfo.type === "text") {
      newMessage = {
        group_id: groupId,
        sender_id: user._id,
        content: messageInfo.content,
        message_type: messageInfo.type,
      };
    } else if (messageInfo.type === "file") {
      newMessage = {
        group_id: groupId,
        sender_id: user._id,
        content: "file",
        message_type: messageInfo.type,
        attachment_url: messageInfo.fileUrl,
      };
    }

    // Gửi qua socket
    socket.emit("sendMessage", newMessage);
    // Chỉ chờ socket server gửi về "newMessage"
  };

  if (userLoading) return <p>Đang tải người dùng...</p>;
  if (!user) return <p>Vui lòng đăng nhập để sử dụng tính năng này.</p>;

  if (!active) {
    return (
      <div className="no-chat-selected">
        <h3>Vui lòng chọn một cuộc trò chuyện</h3>
      </div>
    );
  }

  return (
    <div className="chat-area">
      <div className="chat-header">
        {active.activeName ? (
          <h3>{active.activeName}</h3>
        ) : (
          <h3>{active.name}</h3>
        )}
        <button
          onClick={() => {
            // Chuyển đến trang thành viên nhóm
            onActiveFeature("group-members");
          }}
        >
          <span>Xem thành viên nhóm</span>
        </button>
      </div>
      <div className="chat-history">
        {messagesLoading ? (
          <p>Đang tải...</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id?._id === user._id;
            return (
              <div
                key={msg._id}
                className={`message-wrapper ${isMe ? "sent" : "received"}`}
              >
                {msg.sender_id?.avatar && isMe === false ? (
                  <img
                    src={msg.sender_id.avatar}
                    alt="Avatar"
                    className="avatar"
                  />
                ) : (
                  <> </>
                )}

                <div className="message-bubble">
                  {isMe ? (
                    <></>
                  ) : (
                    <div className="message-sender">
                      <span>{msg.sender_id?.username}</span>
                    </div>
                  )}

                  {msg.message_type === "text" ? (
                    <span>{msg.content}</span>
                  ) : (
                    <a
                      href={msg.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {msg.attachment_url}
                    </a>
                  )}

                  <div className="message-time">
                    {formatTime(msg.created_at)}
                  </div>
                </div>
              </div>
            );
          })
        )}
         <div ref={bottomRef}></div>
      </div>
      <MessageInput onSend={handleSend} scrollToBottom={scrollToBottom}/>
    </div>
  );
};

export default ChatArea;
