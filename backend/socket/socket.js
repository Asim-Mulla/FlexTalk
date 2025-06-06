import express from "express";
import { Server } from "socket.io";
import http from "http";
import "dotenv/config";
import { log } from "console";

const app = express();
const server = http.createServer(app);
const clientUrl = process.env.CLIENT_URL;

const io = new Server(server, {
  cors: { origin: clientUrl, credentials: true },
});

let usersSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (!userId) {
    return;
  }

  usersSocketMap[userId] = socket.id;

  io.emit("onlineUsers", Object.keys(usersSocketMap));

  socket.on("isTyping", (typingData) => {
    io.to(usersSocketMap[typingData.to]).emit("otherPersonTyping", typingData);
  });

  socket.on("disconnect", () => {
    delete usersSocketMap[userId];

    io.emit("onlineUsers", Object.keys(usersSocketMap));
  });
});

const getSocketId = (userId) => {
  return usersSocketMap[userId];
};

export { io, app, server, getSocketId };
