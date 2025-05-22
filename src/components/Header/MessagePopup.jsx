import { useState, useEffect } from "react";
import api from "../../../axiosConfig";
import { useActiveChat } from "../../hooks/useAuth";
const MessagePopup = ({ onClose, onFeatureSelect, unreadGroupIds, onSetunreadGroupCount }) => {
  const { setActive } = useActiveChat();
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/groups/user-groups", {
          withCredentials: true,
        });
        //console.log("Groups:", response.data.groups);
        setGroups(response.data.groups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const markMessageAsRead = async (groupId) => {
    try {
      const res = await api.put(`/messages/mark-as-read/${groupId}`, {}, { withCredentials: true });
      if (res.status === 200) {
        console.log("number of changed messages:", res.data.modifiedCount);
      } else {
        console.error("Failed to mark as read");
      }
    }catch (error) {
      console.error("Error marking message as read:", error);
    }
  }

  return (
    <div className="message-popup">
      <h4>Tin nhắn gần đây</h4>
      {groups
        .filter((group) => group.last_message !== null)
        .map((group) => {

        const isUnread = unreadGroupIds.includes(group._id);
          return (
            <div
              key={group._id}
              className={`message-item ${isUnread ? "unread" : ""}`}
              onClick={() => {
                markMessageAsRead(group._id);
                onSetunreadGroupCount((prevCount) => prevCount - 1);
                setActive(group);
                onFeatureSelect("chat");
                onClose();
              }}
            >
              <div>
                {group.active_avatar ? (
                  <img
                    className="default-avatar"
                    src={group.active_avatar}
                    alt={group.name}
                  />
                ) : (
                  <div className="default-avatar">{group.name.charAt(0)}</div>
                )}
              </div>
              <div className="message-info">
                <div className="name">{group.name}</div>
                <div className="last-message">{group.last_message.content}</div>
                <div className="time">
                  {formatDate(group.last_message.created_at)}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default MessagePopup;
