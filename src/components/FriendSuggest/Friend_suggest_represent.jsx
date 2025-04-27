import UserRepresent from "../UserRepresent/UserRepresent";
import { useState, useEffect, use } from "react";
import api from "../../../axiosConfig";

const FriendSuggestRepresent = ({
  user,
  setTargetUser,
  setActiveFeature,
  onSendFriendRequest,
  onAcceptRequest,
  onCancelRequest,
}) => {
  const [friendShipStatus, setFriendShipStatus] = useState(""); // Trạng thái kết bạn của người dùng
  const [featureFunction, setFeatureFunction] = useState(null);
  const getFriendshipStatus = async (friendId) => {
    try {
      const response = await api.post(
        "/user_friendships/status",
        {
          friendId,
        },
        {
          withCredentials: true,
        }
      );
      setFriendShipStatus(response.data.status);
    } catch (error) {
      setFriendShipStatus("Lỗi khi tìm trạng thái kết bạn:", error);
    }
  };

  const handlebuttonClick = async () => {
    switch (friendShipStatus) {
      case "Huỷ lời mời kết bạn":
        setFeatureFunction(() => onCancelRequest);
        break;
      case "Kết bạn":
        setFeatureFunction(() => onSendFriendRequest);
        break;
      case "Chấp nhận lời mời":
        setFeatureFunction(() => onAcceptRequest);
        break;
      default:
        setFeatureFunction(null);
        break;
    }
  }

  useEffect(() => {
    getFriendshipStatus(user._id);
  }, []);

  useEffect(() => {
    handlebuttonClick();
  },[friendShipStatus]);
  
  
  return (
    <div className="friend-suggest-represent">
      <UserRepresent user={user} />
      <div className="friend-suggest-represent-action">
        <button
          className="btn btn-primary"
          onClick={async () => {
            await featureFunction(user._id);
            await getFriendshipStatus(user._id);
          }}
        >
          {friendShipStatus}
        </button>
        <button
          onClick={() => {
            setTargetUser(user);
            setActiveFeature("user-profile");
          }}
          className="btn btn-secondary"
        >
          Xem trang cá nhân
        </button>
      </div>
    </div>
  );
};

export default FriendSuggestRepresent;
