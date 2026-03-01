/* ====== JAILEX UI & TIMERS ====== */

// 1. Tab Switching
document.querySelectorAll(".tab-button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.getAttribute("data-target");
    if (document.getElementById(target)) document.getElementById(target).classList.add("active");
  };
});

// 2. Global addMessage (links UI to Audio Engine)
function addMessage(msg) {
  const log = document.getElementById("chatLog");
  if (!log) return;

  const div = document.createElement("div");
  div.className = "chat-line";
  const color = msg.platform === "kick" ? "#53fc18" : "#a970ff";
  div.innerHTML = `<span style="color:${color};font-weight:600">[${msg.platform.toUpperCase()}] ${msg.username}:</span> ${msg.message}`;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;

  // SEND TO AUDIO ENGINE
  addToQueue(msg);
}

// 3. Audio Control Buttons
document.getElementById("enableAudioBtn").onclick = () => {
  audioEnabled = true; // Variable in audio-engine.js
  speechSynthesis.speak(new SpeechSynthesisUtterance("Audio active"));
};

document.getElementById("playPauseBtn").onclick = function() {
  isPlaying = !isPlaying;
  this.textContent = isPlaying ? "Pause" : "Play";
};

document.getElementById("muteBtn").onclick = function() {
  isMuted = !isMuted;
  this.textContent = isMuted ? "Unmute" : "Mute";
};

// 4. Sliders
document.getElementById("volume").oninput = (e) => ttsVolume = parseFloat(e.target.value);
document.getElementById("rate").oninput = (e) => ttsRate = parseFloat(e.target.value);

// 5. Test Buttons
document.getElementById("testTtsBtn").onclick = () => {
  addMessage({platform:"kick", username:"Jailex", message:"Audio Engine is online!"});
};
