/* ====== JAILEX UI CONTROLLER ====== */

// 1. Tab Navigation
document.querySelectorAll(".tab-button").forEach(btn => {
    btn.onclick = () => {
        // Remove active from all
        document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
        
        // Add to clicked
        btn.classList.add("active");
        const targetId = btn.getAttribute("data-target");
        if (document.getElementById(targetId)) {
            document.getElementById(targetId).classList.add("active");
        }
    };
});

// 2. Initialize Engine (Required for Browser Audio)
document.getElementById("enableAudioBtn").onclick = () => {
    window.audioEnabled = true;
    const starter = new SpeechSynthesisUtterance("Audio engine fully operational.");
    speechSynthesis.speak(starter);
    alert("TTS Engine Initialized. You are ready to stream.");
};

// 3. Test Sequence
document.getElementById("testTtsBtn").onclick = () => {
    if (!window.audioEnabled) {
        alert("Please click 'Initialize Engine' first.");
        return;
    }
    window.addMessage({
        platform: "system",
        username: "Jailex HUD",
        message: "Diagnostics complete. Syncing with Quick Sync Engine."
    });
};
