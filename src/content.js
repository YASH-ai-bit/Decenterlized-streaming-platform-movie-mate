// Connect to WebSocket server
const socket = new WebSocket("wss://localhost:3001");

// Listen for sync messages
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === "sync_video") {
        const video = document.querySelector("video");
        if (video) {
            video.currentTime = data.timestamp;
            if (data.action === "play") video.play();
            if (data.action === "pause") video.pause();
        }
    }
};

// Detect play/pause and send updates
document.querySelector("video").addEventListener("play", () => {
    socket.send(JSON.stringify({ type: "sync_video", action: "play", timestamp: video.currentTime }));
});
document.querySelector("video").addEventListener("pause", () => {
    socket.send(JSON.stringify({ type: "sync_video", action: "pause", timestamp: video.currentTime }));
});
