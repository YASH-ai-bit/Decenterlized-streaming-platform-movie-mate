// content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "syncPlayback") {
    const video = document.querySelector("video");
    if (video) {
      if (message.isPlaying) video.play();
      else video.pause();
      video.currentTime = message.currentTime;
    }
  }
});