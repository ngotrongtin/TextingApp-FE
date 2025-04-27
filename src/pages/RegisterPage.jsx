import React, { useState } from 'react';
import api from '../../axiosConfig'; 
import './auth.css';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate(); 
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Đăng ký với:', form);
    api.post('user/register', form)
      .then((response) => {
        console.log('Đăng ký thành công:', response.data);
        navigate('/login',{
          state: { message: "Đăng ký thành công! Hãy đăng nhập nhé 💌" },
        }); 
      })
      .catch((error) => {
        console.error('Lỗi đăng ký:', error);
        // Xử lý lỗi (thông báo cho người dùng, v.v.)
      });
  };

  return (
    <div className="auth-container">
      <h2>Đăng ký</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="username"
          placeholder="Tên hiển thị"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
};

export default RegisterPage;
