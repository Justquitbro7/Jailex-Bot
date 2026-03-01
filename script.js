/* ====== JAILEX UI ====== */
document.querySelectorAll(".tab-button").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(btn.getAttribute("data-target")).classList.add("active");
    };
});

document.getElementById("enableAudioBtn").onclick = () => {
    window.audioEnabled = true;
    speechSynthesis.speak(new SpeechSynthesisUtterance("Audio system online."));
};

document.getElementById("playPauseBtn").onclick = function() {
    window.isPlaying = !window.isPlaying;
    this.textContent = window.isPlaying ? "PAUSE" : "PLAY";
};

document.getElementById("testTtsBtn").onclick = () => {
    if (!window.audioEnabled) return alert("Click Start Engine first!");
    window.addMessage({ platform: "kick", username: "System", message: "Test voice sequence active." });
};
