import MessagePopup from "./MessagePopup";
import React, { useState, useEffect } from "react";
import NotificationPopup from "./NotificationPopup";
import api from "../../../axiosConfig";
import { socket } from "../../socket/index";
const Header_features = ({ onFeatureSelect }) => {
  const [showMessagePopup, setshowMessagePopup] = useState(false);
  const [unreadGroupCount, setUnreadGroupCount] = useState(0);
  const [unreadGroupIds, setUnreadGroupIds] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const toggleNotificationPopup = () => {
    setShowNotificationPopup(!showNotificationPopup);
  };
  const toggleMessagePopup = () => {
    setshowMessagePopup(!showMessagePopup);
  };

  const fetchUnreadGroupCount = async () => {
    try {
      const res = await api.get("/messages/unread-messages", {
        withCredentials: true,
      });
      setUnreadGroupCount(res.data.count);
      setUnreadGroupIds(res.data.groups);
      //console.log("id nhóm có tin nhắn chưa đọc", res.data.groups);
    } catch (err) {
      console.error("Lỗi khi lấy số nhóm có tin nhắn chưa đọc", err);
    }
  };

  useEffect(() => {
    const handleNotification = async (notification) => {
      setNotifications((prev) => [...prev, notification]);
      await fetchUnreadGroupCount();
    };

    socket.on("newMessageNotification", handleNotification);

    return () => {
      socket.off("newMessageNotification", handleNotification);
    };
  }, []);

  useEffect(() => {
    fetchUnreadGroupCount();
  }, []);

  return (
    <div className="header-features">
      <button
        className="header-features-item"
        onClick={() => onFeatureSelect("friend-suggest")}
      >
        Gợi ý kết bạn
      </button>

      <button className="header-features-ite" onClick={toggleMessagePopup}>
        <span>Tin nhắn</span>
        {/* Badge hiển thị số group chưa đọc */}
        {unreadGroupCount > 0 && (
          <span className="message-badge">{unreadGroupCount}</span>
        )}
      </button>

      {showMessagePopup && (
        <MessagePopup
          onClose={() => setshowMessagePopup(false)}
          onFeatureSelect={onFeatureSelect}
          unreadGroupIds={unreadGroupIds}
          onSetunreadGroupCount={setUnreadGroupCount}
        />
      )}
      <button
        className="header-features-item"
        onClick={() => {
          onFeatureSelect("create-group");
        }}
      >
        <span>Tạo nhóm chat</span>
      </button>

      <button
        onClick={toggleNotificationPopup}
        className="header-features-item"
      >
        <span>Thông báo</span>
        {showNotificationPopup && (
          <NotificationPopup notifications={notifications} />
        )}
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>
    </div>
  );
};

export default Header_features;
