/* ====== JAILEX UI CONTROLLER ====== */

// 1. Tab Navigation
document.querySelectorAll(".tab-button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.getAttribute("data-target");
    const panel = document.getElementById(target);
    if (panel) panel.classList.add("active");
  };
});

// 2. Audio Buttons (Updating Engine Variables)
document.getElementById("enableAudioBtn").onclick = () => {
  audioEnabled = true; // In audio-engine.js
  const starter = new SpeechSynthesisUtterance("Audio system active.");
  speechSynthesis.speak(starter);
};

document.getElementById("playPauseBtn").onclick = function() {
  isPlaying = !isPlaying;
  this.textContent = isPlaying ? "PAUSE" : "PLAY";
};

document.getElementById("muteBtn").onclick = function() {
  isMuted = !isMuted;
  this.textContent = isMuted ? "UNMUTE" : "MUTE";
};

// 3. Sliders
document.getElementById("volume").oninput = (e) => volume = parseFloat(e.target.value);
document.getElementById("rate").oninput = (e) => rate = parseFloat(e.target.value);

// 4. Test Buttons (Fix for the broken button)
document.getElementById("testTtsBtn").onclick = () => {
  if (!audioEnabled) {
    alert("You must click '1. START ENGINE' first!");
    return;
  }
  addMessage({
    platform: "kick",
    username: "JailexTester",
    message: "The new Blueprint engine is working perfectly!"
  });
};

document.getElementById("testTimerBtn").onclick = () => {
  addMessage({
    platform: "timer",
    username: "Timer",
    message: "Test timer alert."
  });
};
