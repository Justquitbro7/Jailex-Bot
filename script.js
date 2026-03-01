/* ====== JAILEX AUDIO ENGINE & UI HANDLER ====== */

let speechQueue = [];
let isSpeaking = false;

// Global function to add messages from kick.js or twitch.js
window.addMessage = function(data) {
    // 1. Update Preview UI
    const preview = document.getElementById('chat-preview');
    const msgLine = document.createElement('div');
    msgLine.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
    preview.prepend(msgLine);

    // 2. Add to TTS Queue
    speechQueue.push(data);
    processTTS();
};

function processTTS() {
    if (isSpeaking || speechQueue.length === 0) return;

    isSpeaking = true;
    const current = speechQueue.shift();
    
    // Clean message for better TTS
    const cleanText = `${current.username} says ${current.message}`;
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Professional Settings
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Handle complete
    utterance.onend = () => {
        isSpeaking = false;
        setTimeout(processTTS, 200); // Small gap between messages
    };

    utterance.onerror = () => {
        isSpeaking = false;
        processTTS();
    };

    window.speechSynthesis.speak(utterance);
}

// Bot filtering logic (can be called by platform files)
window.isBot = function(username) {
    const bots = ['botrix', 'streamelements', 'nightbot', 'moobot'];
    return bots.includes(username.toLowerCase());
};
