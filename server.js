const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("WebSocket Server is Running!");
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // When a user joins a board using blockchain-generated room code
  socket.on("join-board", (roomCode) => {
    socket.join(roomCode);
    console.log(`User ${socket.id} joined board: ${roomCode}`);

    // Notify users in the room to redirect to YouTube page
    io.to(roomCode).emit("redirect-to-youtube", { roomCode });
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log("WebSocket server running on port 3001");
});
