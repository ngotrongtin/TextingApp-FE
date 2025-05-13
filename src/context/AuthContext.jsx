import { createContext, useEffect, useState } from "react";
import api from "../../axiosConfig";
import { socket } from "../socket";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null: chưa biết login chưa
  const [loading, setLoading] = useState(true); // để chờ fetch user lần đầu

  useEffect(() => {
    api
      .get("/me", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post(
      "user/login",
      { email, password },
      { withCredentials: true }
    );

    setUser(res.data.user); // lưu user vào context
    return res
  };

  const logout = async () => {
    await api.post("user/logout", {}, { withCredentials: true });
    setUser(null);
    alert("Đăng xuất thành công!");
    socket.disconnect(); 
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
