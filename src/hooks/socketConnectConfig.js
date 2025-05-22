import { useEffect } from "react";
import { socket } from "../socket";
import { useAuth } from "./useAuth";

const UseSocketOnline = () => {
  const auth = useAuth();
  const user = auth?.user;
  useEffect(() => {
    if (!user) return; // nếu chưa có user thì không làm gì
    
    // Kết nối thủ công
    if (!socket.connected) {
      
      socket.connect();
    }
    // Callback sẽ chạy khi socket kết nối thành công
    const handleConnect = () => {
      
      if (user) {
        socket.emit("user-onlines", user._id);
      }
    };

    // Gắn sự kiện
    socket.on("connect", handleConnect);
    // Cleanup: gỡ bỏ listener khi user thay đổi hoặc component unmount
    return () => {
      socket.off("connect", handleConnect);
    };
  }, [user]);

  return null;
};

export default UseSocketOnline;
