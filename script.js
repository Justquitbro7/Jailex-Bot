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

// 2. INITIALIZE ENGINE (REQUIRED FOR AUDIO)
document.getElementById("enableAudioBtn").onclick = () => {
  window.audioEnabled = true;
  const starter = new SpeechSynthesisUtterance("Jailex Audio Engine is now online.");
  speechSynthesis.speak(starter);
  console.log("JAILEX: Audio Engine Activated");
};

// 3. TEST SEQUENCE
document.getElementById("testTtsBtn").onclick = () => {
  if (!window.audioEnabled) {
    alert("CRITICAL: You must click 'Initialize Engine' first.");
    return;
  }
  window.addMessage({
    platform: "system",
    username: "Jailex HUD",
    message: "Diagnostic check complete. System ready."
  });
};
