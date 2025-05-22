const NotificationPopup = ({ notifications }) => {
  return (
    <div className="notification-popup">
      {notifications.length === 0 ? (
        <p>Không có thông báo nào.</p>
      ) : (
        notifications.map((noti, index) => (
          <div key={index} className="notification-item">
            {noti.notification}
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationPopup;