import { useState, useEffect } from "react";
import api from "../../../axiosConfig";
import "./groupCreate.css";
import { useActiveChat } from "../../hooks/useAuth";
const Group = ({ onActiveFeature }) => {
  const [groupName, setGroupName] = useState("");
  //const [groupAvatar, setGroupAvatar] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { setActive } = useActiveChat();
  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user_friendships/list", {
          withCredentials: true,
        });
        console.log("Danh sách bạn bè:", response.data);
        setUsers(response.data.listfriend);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bạn bè:", error);
      }
    };

    fetchUsers();
  }, []);
  // Handle group creation
  const handleCreateGroup = async () => {
    if (!groupName) {
      setErrorMessage("Vui lòng nhập tên nhóm.");
      return;
    }

    if (selectedUsers.length < 1) {
      setErrorMessage("Vui lòng chọn ít nhất một thành viên.");
      return;
    }

    try {
      const response = await api.post(
        "/groups/create-group-chat",
        {
          name: groupName,
          memberIds: selectedUsers.map((user) => user._id),
        },
        { withCredentials: true }
      );

      console.log("Group created:", response.data.group);
      setSuccessMessage("Nhóm đã được tạo thành công!");
      setErrorMessage("");
      setActive(response.data.group);
      onActiveFeature("chat");
    } catch (error) {
      console.error("Error creating group:", error);
      setErrorMessage("Đã xảy ra lỗi khi tạo nhóm.");
    }
  };

  // Handle file input change
  // const handleFileChange = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //         setGroupAvatar(file);
  //     }
  // };
  // Handle user selection
  const handleUserSelect = (user) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };
  // Handle search query change
  const [searchQuery, setSearchQuery] = useState("");
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Render the component
  return (
    <div className="group-create">
      <h2>Tạo nhóm chat</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <input
        type="text"
        placeholder="Tên nhóm"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tìm kiếm bạn bè"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="user-list">
        {filteredUsers.map((user) => {
          const isSelected = selectedUsers.some((u) => u._id === user._id);
          return (
            <div
              key={user._id}
              className={`user-item ${isSelected ? "selected" : ""}`}
              onClick={() => handleUserSelect(user)}
            >
              <img
                src={user.avatar || "/default-avatar.png"}
                alt={user.username}
              />
              <span>{user.username}</span>
              {isSelected && <span className="checkmark">✔</span>}
            </div>
          );
        })}
      </div>
      <button onClick={handleCreateGroup}>Tạo nhóm</button>
    </div>
  );
};
export default Group;
