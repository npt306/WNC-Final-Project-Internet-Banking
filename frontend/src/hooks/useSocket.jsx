import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";

// const socket = io('http://localhost:3000');
const socket = io(import.meta.env.VITE_API_URL);

const useSocket = () => {
  const [state, setState] = useState(false);

  // Khởi tạo socket với ID người dùng
  const initialize = useCallback((myId) => {
    if (!myId) return;
    socket.emit("initialize", { id: myId });
  }, []);

  // Gửi thông báo tới người nhận
  const send = useCallback((recipientId) => {
    if (!recipientId) return;
    socket.emit("send", { recipientId });
  }, []);

  // Lắng nghe sự kiện nhận thông báo
useEffect(() => {
  const handleReceive = (newState) => {
    // Sử dụng callback để đảm bảo cập nhật state một cách chắc chắn
    setState((prevState) => {
      if (prevState === newState) {
        return !newState; // Nếu trùng lặp, đảo ngược lại giá trị
      }
      return newState;
    });
  };

  socket.on("receive", handleReceive);

  return () => {
    socket.off("receive", handleReceive);
  };
}, []);


  return { state, initialize, send };
};

export default useSocket;
