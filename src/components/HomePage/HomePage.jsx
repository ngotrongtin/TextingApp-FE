import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import ChatArea from "../ChatArea/ChatArea";
import FriendSuggest from "../FriendSuggest/Friend_suggest";
import UpdateProfile from "../UserUpdate/ProfileUpdate";
import UserProfile from "../UserProfile/UserProfile";
import { useAuth } from "../../hooks/useAuth";
import Group from "../Group/GroupCreate";
import GroupMember from "../Group/GroupMember";
const HomePage = ({ activeFeature, setActiveFeature }) => {
  const [targetUser, setTargetUser] = useState(null);
  const { user } = useAuth(); // Lấy thông tin người dùng từ context
  // const handleChatSelect = (chat) => {
  //   setActive(chat);
  // };
  let content;
  if (activeFeature === "chat") {
    content = <ChatArea onActiveFeature={setActiveFeature}/>;
  } else if (activeFeature === "friend-suggest") {
    content = (
      <FriendSuggest
        setTargetUser={setTargetUser}
        setActiveFeature={setActiveFeature}
      />
    );
  } else if (activeFeature === "update-profile") {
    content = <UpdateProfile />;
  } else if (activeFeature === "user-profile") {
    content = <UserProfile user={targetUser || user} />;
  } else if (activeFeature === "create-group") {
    content = <Group onActiveFeature={setActiveFeature} />;
  } else if (activeFeature === "group-members") {
    content = <GroupMember />;
  } else {
    content = <div>Chưa có nội dung</div>;
  }
  return (
    <div className="home-page">
      <div className="main-content">
        <Sidebar onActiveFeature={setActiveFeature} />
        {content}
      </div>
    </div>
  );
};

export default HomePage;
