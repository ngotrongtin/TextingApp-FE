import React, { useState, useEffect } from "react";
import UserRepresent from "../UserRepresent/UserRepresent";
import api from "../../../axiosConfig"; // Giả sử bạn đã cấu hình axios trong tệp này
const Sidebar = ({ onSelectChat, onActiveFeature }) => {

  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/user_friendships/list", { withCredentials: true }).then((response) => {
      // Giả sử response.data chứa danh sách bạn bè
      console.log("Danh sách bạn bè:", response.data);
      setUsers(response.data.listfriend);
    }
    ).catch((error) => {
      //console.error("Lỗi khi lấy danh sách bạn bè:", error);
      // Xử lý lỗi nếu cần
    });
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <li key={user._id} onClick={async () =>{
            await onSelectChat(user);
            await onActiveFeature("chat");
          }}>
            <UserRepresent user={user} />
          </li>
        ))}
      </ul>
      {/* Thêm logic hiển thị danh sách nhóm chat nếu có */}
    </div>
  );
};

export default Sidebar;
