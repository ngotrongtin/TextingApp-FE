import { useEffect, useState } from "react";
import api from "../../../axiosConfig";
import FriendSuggestRepresent from "./Friend_suggest_represent";
import "./index.css";
const FriendSusgest = ({ setTargetUser, setActiveFeature }) => {
  const [friendSuggestions, setFriendSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchFriendSuggestions = async () => {
    try {
      const response = await api.get("/user/strangers", {
        withCredentials: true,
      });
      setFriendSuggestions(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bạn bè gợi ý:", error);
    }
  };

  const filteredFriendSuggestions = friendSuggestions.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Gọi fetchFriendSuggestions khi component mount
  useEffect(() => {
    fetchFriendSuggestions();
  }, []); // Thêm [] để useEffect chỉ chạy một lần khi component mount

  // Hàm gửi yêu cầu kết bạn và cập nhật lại danh sách bạn bè gợi ý
  const handleSendFriendRequest = async (friendId) => {
    try {
      const response = await api.post(
        "user_friendships/add_friend",
        { friendId },
        { withCredentials: true }
      );
      // Sau khi gửi lời mời kết bạn thành công, gọi lại hàm fetchFriendSuggestions để làm mới danh sách
      fetchFriendSuggestions();
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu kết bạn:", error);
    }
  };

  const handleCancelRequest = async (friendId) => {
    try {
      const response = await api.post(
        "user_friendships/reject",
        { friendId },
        { withCredentials: true }
      );
      // Sau khi gửi lời mời kết bạn thành công, gọi lại hàm fetchFriendSuggestions để làm mới danh sách
      fetchFriendSuggestions();
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu kết bạn:", error);
    }
  }
  const handleAcceptRequest = async (friendId) => {
    try {
      const response = await api.post(
        "user_friendships/accept",
        { friendId },
        { withCredentials: true }
      );
      // Sau khi gửi lời mời kết bạn thành công, gọi lại hàm fetchFriendSuggestions để làm mới danh sách
      fetchFriendSuggestions();
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu kết bạn:", error);
    }
  };

  return (
    <div className="friend-suggest">
      <h2>Gợi ý bạn bè</h2>
      <input
        type="text"
        placeholder="Tìm kiếm người lạ"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
      <ul>
        {filteredFriendSuggestions.length > 0 ? (
          filteredFriendSuggestions.map((friend) => (
            <li key={friend._id}>
              <FriendSuggestRepresent
                user={friend}
                setActiveFeature={setActiveFeature}
                setTargetUser={setTargetUser}
                onSendFriendRequest={handleSendFriendRequest}
                onAcceptRequest={handleAcceptRequest}
                onCancelRequest={handleCancelRequest}
              />
            </li>
          ))
        ) : (
          <li>Không có gợi ý bạn bè nào!</li>
        )}
      </ul>
    </div>
  );
};

export default FriendSusgest;
