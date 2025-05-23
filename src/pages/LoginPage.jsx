import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const handleLogin = async (e) => {
    e.preventDefault();
    let status;
    try {
      status = await login(email, password); // đợi login thành công
      // navigate('/', {
      //   state: { message: "Đăng nhập thành công!" },
      // });

      window.location.href = '/'; // Tải lại trang hoàn toàn
      alert("Đăng nhập thành công!");
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      // Có thể hiện thông báo lỗi lên giao diện ở đây
      alert(error.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <div className="auth-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default LoginPage;
