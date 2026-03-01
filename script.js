/* ====== JAILEX UI CONTROLLER ====== */
document.getElementById("enableAudioBtn").onclick = () => {
    window.audioEnabled = true;
    const s = new SpeechSynthesisUtterance("Audio system unlocked.");
    speechSynthesis.speak(s);
    alert("JAILEX: Audio Engine Initialized.");
};

document.getElementById("testTtsBtn").onclick = () => {
    if (!window.audioEnabled) return alert("Initialize Engine First.");
    window.addMessage({ 
        platform: "system", 
        username: "Jailex", 
        message: "Diagnostic check successful. Handshake active." 
    });
};
