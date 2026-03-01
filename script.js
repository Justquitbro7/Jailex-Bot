/* ====== JAILEX UI CONTROLLER ====== */

// 1. TAB NAVIGATION
document.querySelectorAll(".tab-button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    const targetId = btn.getAttribute("data-target");
    if (document.getElementById(targetId)) {
      document.getElementById(targetId).classList.add("active");
    }
  };
});

// 2. INITIALIZE ENGINE (REQUIRED)
document.getElementById("enableAudioBtn").onclick = () => {
  window.audioEnabled = true;
  const starter = new SpeechSynthesisUtterance("Audio engine fully operational.");
  speechSynthesis.speak(starter);
  console.log("JAILEX: Audio Engine Initialized");
};

// 3. PLAY/PAUSE LOGIC
document.getElementById("playPauseBtn").onclick = function() {
  window.isPlaying = !window.isPlaying;
  this.textContent = window.isPlaying ? "PAUSE LOOP" : "RESUME LOOP";
};

// 4. TEST SEQUENCE (Fix for the broken button)
document.getElementById("testTtsBtn").onclick = () => {
  if (!window.audioEnabled) {
    alert("CRITICAL: You must click 'Initialize Engine' first.");
    return;
  }
  window.addMessage({
    platform: "system",
    username: "Jailex HUD",
    message: "Blueprint sync successful. Audio engine is now online."
  });
};
