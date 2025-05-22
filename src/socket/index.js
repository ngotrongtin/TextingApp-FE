// src/socket/index.js
import { io } from "socket.io-client";
// Khởi tạo socket connection
export const socket = io("http://localhost:3000", {
  withCredentials: true,   // Gửi kèm cookie/session nếu backend yêu cầu
  autoConnect: false,       // Tự động connect khi khởi tạo
  reconnection: true,      // Tự động reconnect khi mất kết nối
  reconnectionAttempts: 5, // Số lần thử reconnect (5 lần)
  reconnectionDelay: 1000, // 1s giữa mỗi lần reconnect
  transports: ["websocket"], // Ưu tiên WebSocket, fallback nếu cần
});

// --- Các sự kiện cơ bản để theo dõi ---

// Khi disconnect
socket.on("disconnect", (reason) => {
  console.warn("⚠️ Socket disconnected:", reason);
});

// Khi lỗi kết nối
socket.on("connect_error", (error) => {
  
});

// Khi đang reconnect
socket.on("reconnect_attempt", (attempt) => {
  console.info(`🔄 Reconnect attempt ${attempt}`);
});
