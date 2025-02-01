// popup.js
document.getElementById("joinRoom").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "joinRoom" });
    });
  });
  
  document.getElementById("syncPlayback").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "syncPlayback" });
    });
  });