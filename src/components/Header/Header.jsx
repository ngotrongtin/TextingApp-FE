import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Header_features from "./Header_features";
const Header = ({ onFeatureSelect }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const handleLogout = async () => {
    await logout(); // Đợi logout gọi API nếu có
    navigate("/login"); // Rồi chuyển hướng
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h1>
          <Link to="/">Messenger App</Link>
        </h1>
        {user ? <Header_features onFeatureSelect={onFeatureSelect} /> : <></>}
      </div>
      <div className="header-right">
        {user ? (
          <>
            <div className="user-info">
              <span>{user.username}</span>
              <img src={user.avatar || "/default-avatar.png"} alt="Avatar" className="avatar" />
            </div>
            <div className="settings-wrapper" style={{ position: "relative" }}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="btn btn-secondary"
              >
                Cài đặt
              </button>
              {showSettings && (
                <div className="settings-dropdown">
                  <button
                    onClick={() => {
                      onFeatureSelect("update-profile");
                      setShowSettings(false);
                    }}
                    className="btn btn-light"
                  >
                    Cập nhật hồ sơ
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowSettings(false);
                    }}
                    className="btn btn-danger"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary">
              Đăng nhập
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
