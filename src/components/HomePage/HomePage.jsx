import { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import ChatArea from "../ChatArea/ChatArea";
import FriendSuggest from "../FriendSuggest/Friend_suggest";
import UpdateProfile from "../UserUpdate/ProfileUpdate";
import UserProfile from "../UserProfile/UserProfile";
import { useAuth } from "../../hooks/useAuth";
import Group from "../Group/GroupCreate";
import GroupMember from "../Group/GroupMember";
import "./homePage.css";
const HomePage = ({ activeFeature, setActiveFeature }) => {
  const [targetUser, setTargetUser] = useState(null);
  const { user } = useAuth(); 
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

   // Theo dõi thay đổi kích thước cửa sổ
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarVisible(true); // luôn hiện trên desktop
      }else{
        setSidebarVisible(false); // ẩn trên mobile
      }
    };
    handleResize(); // gọi khi load lần đầu
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  let content;
  if (activeFeature === "chat") {
    content = <ChatArea onActiveFeature={setActiveFeature} />;
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
      {isMobile && (
        <button
          className="toggle-sidebar-btn"
          onClick={() => setSidebarVisible((prev) => !prev)}
        >
          ☰ Menu
        </button>
      )}
      <div className="main-content">
         {(isSidebarVisible || !isMobile) && (
          <Sidebar onActiveFeature={setActiveFeature} />
        )}
        {content}
      </div>
    </div>
  );
};

export default HomePage;
