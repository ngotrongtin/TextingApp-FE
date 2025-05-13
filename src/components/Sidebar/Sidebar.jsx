import { useState, useEffect } from "react";
import UserRepresent from "../UserRepresent/UserRepresent";
import { useActiveChat } from "../../hooks/useAuth";
import "./group.css";
import { socket } from "../../socket";
import api from "../../../axiosConfig"; // Giả sử bạn đã cấu hình axios trong tệp này
const Sidebar = ({ onActiveFeature }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { setActive } = useActiveChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  useEffect(() => {
    api
      .get("/user_friendships/list", { withCredentials: true })
      .then((response) => {
        // Giả sử response.data chứa danh sách bạn bè
        console.log("Danh sách bạn bè:", response.data);
        setUsers(response.data.listfriend);
      })
      .catch((error) => {
        //console.error("Lỗi khi lấy danh sách bạn bè:", error);
        // Xử lý lỗi nếu cần
      });

    socket.on("online-users", (userIds) => {
      setOnlineUsers(userIds); // userIds là mảng [userId1, userId2, ...]
    });

    return () => {
      socket.off("online-users"); 
    };

  }, []);

  const fetchGroups = async () => {
    try {
      const response = await api.get("/groups/get-joined-groups", {
        withCredentials: true,
      });
      setGroups(response.data.groups);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhóm:", error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Xử lý chọn nhóm công khai
  const onSelectGroup = async (group) => {
    setActive(group);
    onActiveFeature("chat");
  };

  // Lấy thông tin nhóm giữa hai người dùng hoặc tạo nhóm mới nếu chưa có
  const onSelectChat = async (user) => {
    try {
      const response = await api.post(
        "/groups/create-private-group",
        { friendId: user._id },
        { withCredentials: true }
      );
      console.log("Group Data (Sidebar.jsx):", response.data.group);
      const group = response.data.group;
      group.activeName = user.username;
      setActive(group);
    } catch (error) {
      console.error("Error creating or fetching group:", error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await api.delete(`/groups/delete-group/${selectedGroupId}`, {
        withCredentials: true,
      });
      setShowPopup(false);
      setSelectedGroupId(null);
      fetchGroups(); // Cập nhật lại danh sách
    } catch (error) {
      if (error.response?.status === 403) {
        alert(error.response.data.message); // "Bạn không có quyền thực hiện thao tác này trong nhóm"
      } else {
        alert("Đã xảy ra lỗi, vui lòng thử lại sau");
      }
    }
  };

  return (
    <div className="sidebar">
      <input
        type="text"
        placeholder="Tìm kiếm bạn bè"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ul>
        {filteredUsers.map((user) => (
          <li
            key={user._id}
            onClick={async () => {
              await onSelectChat(user);
              await onActiveFeature("chat");
            }}
          >
            <UserRepresent
              user={user}
              isOnline={onlineUsers.includes(user._id)}
            />
          </li>
        ))}
      </ul>
      <hr />

      <div className="public-groups-section">
        <div className="groups-header">
          <h4>Nhóm công khai</h4>
          <button
            className="reload-btn"
            onClick={() => {
              fetchGroups();
            }}
            title="Tải lại danh sách"
          >
            🔄
          </button>
        </div>
        <ul>
          {groups.map((group) => (
            <li key={group._id} className="group-item">
              <span className="group-name" onClick={() => onSelectGroup(group)}>
                📢 {group.name}
              </span>
              <span
                className="group-options"
                onClick={() => {
                  setSelectedGroupId(group._id);
                  setShowPopup(true);
                }}
                title="Tùy chọn"
              >
                ⋮
              </span>
            </li>
          ))}
        </ul>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p>Bạn có chắc muốn xoá nhóm này không?</p>
            <button onClick={handleDeleteGroup}>Xoá</button>
            <button onClick={() => setShowPopup(false)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
