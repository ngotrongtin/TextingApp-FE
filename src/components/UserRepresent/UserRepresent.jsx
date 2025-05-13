import "./UserRepresent.css";

const UserRepresent = ({ user, isOnline }) => {
  return (
    <div className="user-represent">
      <div className="avatar-container">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt={user.username}
          className="avatar"
        />
        {isOnline && <span className="online-dot"></span>}
      </div>
      <h5>{user.username}</h5>
    </div>
  );
};

export default UserRepresent;