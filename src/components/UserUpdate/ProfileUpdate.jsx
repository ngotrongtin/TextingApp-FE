import { useState } from "react";
import api from "../../../axiosConfig";
import { useAuth } from "../../hooks/useAuth";
import "./profileupdate.css";
const UpdateProfile = () => {
  const { user } = useAuth(); 
  if (!user) return <div>Bạn hãy đăng nhập</div>; // Nếu chưa có user, không hiển thị gì cả
  const [userName, setUserName] = useState(user.username || "");
  const [userBio, setUserBio] = useState(user.bio || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("userBio", userBio);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await api.put("/user/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // Gửi cookie (chứa token)
      });

      setMessage("Cập nhật thành công!");
      //if (onUpdated) onUpdated(res.data.user);
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi cập nhật!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="update-profile-form">
      <h2>Cập nhật thông tin</h2>

      <label>Tên người dùng:</label>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        required
      />

      <label>Tiểu sử:</label>
      <textarea
        value={userBio}
        onChange={(e) => setUserBio(e.target.value)}
        rows={3}
      />

      <label>Ảnh đại diện mới:</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setAvatarFile(e.target.files[0])}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}

export default UpdateProfile;
