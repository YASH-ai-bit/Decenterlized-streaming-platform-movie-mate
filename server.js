const http = require("http");
const { Server } = require("socket.io");

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server is running\n");
});

// Create a Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (update this for production)
  },
});

// Store rooms and their data in memory
const rooms = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle room creation
  socket.on("createRoom", ({ roomCode, creator }) => {
    rooms.set(roomCode, {
      creator,
      users: [creator],
    });
    socket.join(roomCode);
    console.log(`Room created: ${roomCode} by ${creator}`);
  });

  // Handle user joining a room
  socket.on("joinRoom", ({ roomCode, userAddress }) => {
    if (rooms.has(roomCode)) {
      const room = rooms.get(roomCode);
      room.users.push(userAddress);
      socket.join(roomCode);
      console.log(`User ${userAddress} joined room: ${roomCode}`);
    } else {
      socket.emit("error", "Room does not exist");
    }
  });

  // Handle playback updates (from frontend)
  socket.on("playback", (data) => {
    console.log("Received playback update:", data);
    socket.to(data.roomCode).emit("playback", data); // Broadcast to all users
  });

  // Handle messages from the Chrome extension
  socket.on("extensionPlayback", (data) => {
    console.log("Extension playback update:", data);
    socket.to(data.roomCode).emit("playback", data); // Broadcast to room
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on  http://localhost.${PORT}`);
});
