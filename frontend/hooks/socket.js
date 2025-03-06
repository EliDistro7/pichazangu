import { io } from "socket.io-client";
import { getLoggedInUserId } from "./useUser";

const socket = io(process.env.NEXT_PUBLIC_SERVER, {
  transports: ["websocket"],
});

socket.on("connection", () => {
  console.log("🔗 Connected to WebSocket:", socket.id);
  const userId = getLoggedInUserId(); // Get logged-in user ID
  if (userId) {
    socket.emit("loginUser", { userId, socketId: socket.id });
  }
});

export default socket;
