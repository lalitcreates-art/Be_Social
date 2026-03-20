import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "./config/env.js";
import { User } from "./models/User.js";

export function attachSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Unauthorized"));
      const decoded = jwt.verify(token, env.jwtSecret);
      socket.user = await User.findById(decoded.userId);
      if (!socket.user) return next(new Error("Unauthorized"));
      next();
    } catch (error) {
      next(error);
    }
  });

  io.on("connection", (socket) => {
    socket.on("conversation:join", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("disconnect", () => {});
  });

  return io;
}
