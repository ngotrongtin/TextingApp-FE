import "./UserRepresent.css";
const UserRepresent = ({ user }) => {
  return (
    <div className="user-represent">
        <h5>{user.username}</h5>
        <img src={user.avatar || "/default-avatar.png"} alt={user.username} className="avatar" />
    </div>
  );
}

export default UserRepresent;