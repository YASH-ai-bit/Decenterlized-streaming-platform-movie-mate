const ws = new WebSocket("ws://localhost:5500"); // Connect to WebSocket server

// Extract roomCode from URL
const urlParams = new URLSearchParams(window.location.search);
const roomCode = urlParams.get("roomCode");

if (!roomCode) {
  console.log("No room code found. Sync disabled.");
} else {
  ws.onopen = () => {
    console.log("Connected to WebSocket Server!");
    ws.send(JSON.stringify({ type: "join", roomCode }));
  };

  // Listen for WebSocket messages
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const video = document.querySelector("video");

    if (video) {
      if (data.type === "play") video.play();
      if (data.type === "pause") video.pause();
      if (data.type === "seek") video.currentTime = data.currentTime;
    }
  };

  // Detect local video events and send updates
  const video = document.querySelector("video");

  if (video) {
    video.addEventListener("play", () => {
      ws.send(JSON.stringify({ type: "play", roomCode }));
    });

    video.addEventListener("pause", () => {
      ws.send(JSON.stringify({ type: "pause", roomCode }));
    });

    video.addEventListener("seeked", () => {
      ws.send(JSON.stringify({ type: "seek", roomCode, currentTime: video.currentTime }));
    });
  }
}
