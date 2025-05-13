import MessagePopup from "./MessagePopup";
import React, { useState } from "react";
const Header_features = ({ onFeatureSelect }) => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="header-features">
      <button
        className="header-features-item"
        onClick={() => onFeatureSelect("friend-suggest")}
      >
        Gợi ý kết bạn
      </button>
      <button className="header-features-item" onClick={togglePopup}>
        <span>Tin nhắn</span>
      </button>
      {showPopup && (
        <MessagePopup
          onClose={() => setShowPopup(false)}
          onFeatureSelect={onFeatureSelect}
        />
      )}
      <button
        className="header-features-item"
        onClick={() => {
          onFeatureSelect("create-group");
        }}
      >
        <span>Tạo nhóm chat</span>
      </button>
    </div>
  );
};

export default Header_features;
