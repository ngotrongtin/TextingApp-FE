import { useState, useEffect } from "react";
import api from "../../../axiosConfig"; 
import { useActiveChat } from "../../hooks/useAuth";
const MessagePopup = ({ onClose, onFeatureSelect }) => {
    const { setActive } = useActiveChat(); 
    const [groups, setGroups] = useState([]);
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await api.get("/groups/user-groups", { withCredentials: true });
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

    return (
        <div className="message-popup">
            <h4>Tin nhắn gần đây</h4>
            {groups
            .filter(group => group.last_message !== null)
            .map(group => (
                <div key={group._id} className="message-item" onClick={() => {
                    setActive(group);
                    onFeatureSelect("chat");
                    onClose(); 
                }}>
                    <div>
                        {group.active_avatar ? (
                            <img className="avatar" src={group.active_avatar} alt={group.name} />
                        ) : (
                            <div className="default-avatar">{group.name.charAt(0)}</div>
                        )}
                    </div>
                    <div className="message-info">
                        <div className="name">{group.name}</div>
                        <div className="last-message">{group.last_message.content}</div>
                        <div className="time">{formatDate(group.last_message.created_at)}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessagePopup;
