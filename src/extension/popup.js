document.getElementById("open-room").addEventListener("click", () => {
    const videoId = prompt("Enter YouTube Video ID:");
    const roomCode = prompt("Enter Room Code:");
  
    if (videoId && roomCode) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}&roomCode=${roomCode}`;
      chrome.tabs.create({ url: youtubeUrl });
    }
  });
  