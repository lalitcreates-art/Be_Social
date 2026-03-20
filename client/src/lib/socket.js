import { io } from "socket.io-client";

let socket;

export function getSocket(token) {
  if (!token) return null;
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      autoConnect: true,
      auth: { token }
    });
  }
  return socket;
}
