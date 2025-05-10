import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import ChatArea from "../ChatArea/ChatArea";
import FriendSuggest from "../FriendSuggest/Friend_suggest";
import UpdateProfile from "../UserUpdate/ProfileUpdate";
import UserProfile from "../UserProfile/UserProfile";
import { useAuth, useActiveChat } from "../../hooks/useAuth";
const HomePage = ({activeFeature, setActiveFeature}) => {
  const [targetUser, setTargetUser] = useState(null);
  const { user } = useAuth(); // Lấy thông tin người dùng từ context
  const { active, setActive } = useActiveChat(); // Lấy thông tin cuộc trò chuyện từ context
  const handleChatSelect = (chat) => {
    setActive(chat);
  };
  let content;
  if (activeFeature === "chat") {
    content = <ChatArea activeChat={active}/>;
  } else if (activeFeature === "friend-suggest") {
    content = <FriendSuggest setTargetUser={setTargetUser} setActiveFeature={setActiveFeature} />;
  } else if (activeFeature === "update-profile") {
    content = <UpdateProfile />;
  } else if (activeFeature === "user-profile") {
    content = <UserProfile user={targetUser || user} />;
  }else {
    content = <div>Chưa có nội dung</div>;
  }
  return (
    <div className="home-page">
      <div className="main-content">
        <Sidebar onSelectChat={handleChatSelect} onActiveFeature={setActiveFeature} />
        {content}
      </div>
    </div>
  );
};

export default HomePage;
