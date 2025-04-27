import "./user-profile.css";
const UserProfile = ({ user }) => {
  const { username, avatar, email, bio } = user;

  return (
    <div className="user-profile">
      <h2>{username}</h2>
      <img
        src={avatar || "/default-avatar.png"}
        alt={username}
        className="avatar"
      />
      <p>
        <strong>Email:</strong> {email}
      </p>
      <p>
        <strong>Giới thiệu:</strong> {bio}
      </p>
      <button>Kết bạn</button>
    </div>
  );
};
export default UserProfile;