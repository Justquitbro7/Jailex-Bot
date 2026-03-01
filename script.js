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

// 2. ENGINE INITIALIZATION (Browser requirement)
document.getElementById("enableAudioBtn").onclick = () => {
    window.audioEnabled = true;
    const starter = new SpeechSynthesisUtterance("Jailex Audio Engine Active.");
    speechSynthesis.speak(starter);
    alert("Audio Engine Unlocked. Jailex is ready.");
};

// 3. DIAGNOSTIC TEST
document.getElementById("testTtsBtn").onclick = () => {
    if (!window.audioEnabled) {
        alert("Initialize Engine first!");
        return;
    }
    window.addMessage({
        platform: "system",
        username: "Jailex",
        message: "Audio-Visual diagnostic successful. Engine is online."
    });
};
