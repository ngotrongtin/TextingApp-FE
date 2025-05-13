import { useState, useEffect } from "react";
import api from "../../../axiosConfig";
import { useActiveChat } from "../../hooks/useAuth";
import "./groupMember.css";
const GroupMember = () => {
  const { active } = useActiveChat(); // thông tin group hiện tại
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetch group members when the component mounts
  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const response = await api.get(`/groups/group-members/${active._id}`, {
          withCredentials: true,
        });
        console.log("Group members:", response.data.members);
        setMembers(response.data.members);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching group members:", error);
        setErrorMessage("Đã xảy ra lỗi khi lấy danh sách thành viên.");
        setLoading(false);
      }
    };

    if (active) {
      fetchGroupMembers();
    }
  }, [active]);
  // Handle member removal
  const handleRemoveMember = async (memberId) => {
    try {
      const response = await api.delete(`/groups/remove-member/${active._id}`, {
        data: { memberId },
        withCredentials: true,
      });
      console.log("Member removed:", response.data);
      alert("Thành viên đã được xóa thành công!");
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member._id !== memberId)
      );
    } catch (error) {
      console.error("Error removing member:", error);
      if (error.response && error.response.status === 403) {
        alert("Bạn không có quyền xóa thành viên này.");
      } else {
        alert("Đã xảy ra lỗi khi xóa thành viên.");
      }
    }
  };

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="group-member">
      <h2>Thành viên nhóm</h2>
      <ul className="member-list">
        {members.map((member) => (
          <li className="member-item" key={member._id}>
            {member.avatar ? (
              <img
                className="avatar"
                src={member.avatar}
                alt={member.username}
              />
            ) : (
              <div className="avatar default-avatar">
                {member.username.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="member-name">{member.username}</span>
            <button
              className="remove-btn"
              onClick={() => handleRemoveMember(member._id)}
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupMember;
