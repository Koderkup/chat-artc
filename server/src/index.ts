import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { roomHandler } from "./room";

dotenv.config();

const app = express();
app.use(cors);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  roomHandler(socket);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
