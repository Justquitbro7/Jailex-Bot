/* ====== JAILEX CORE ENGINE ====== */
let queue = [];
let isPlaying = true;
let isMuted = false;
let isSpeaking = false;
let audioEnabled = false;
let voices = [];
let volume = 1; let rate = 1;
let timers = [];
let ttsEngine = "browser";
let speechifyApiKey = "";
let speechifyVoiceId = "";

/* ====== TAB SWITCHING ====== */
document.querySelectorAll(".tab-button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.getAttribute("data-target")).classList.add("active");
  };
});

/* ====== BROWSER VOICES ====== */
function loadVoices() {
  voices = speechSynthesis.getVoices();
  if (voices.length === 0) { setTimeout(loadVoices, 200); return; }
  ["kickVoice", "timerVoice"].forEach(id => {
    const s = document.getElementById(id);
    s.innerHTML = "";
    voices.forEach(v => {
      let opt = document.createElement("option");
      opt.value = v.name; opt.textContent = v.name;
      s.appendChild(opt);
    });
  });
}
speechSynthesis.onvoiceschanged = loadVoices; loadVoices();

/* ====== GLOBAL ADD MESSAGE ====== */
function addMessage(msg) {
  const log = document.getElementById("chatLog");
  const div = document.createElement("div");
  div.className = "chat-line";
  const color = msg.platform === "kick" ? "#53fc18" : "#a970ff";
  div.innerHTML = `<span style="color:${color};font-weight:600">[${msg.platform}] ${msg.username}:</span> ${msg.message}`;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
  queue.push(msg);
  document.getElementById("queueLen").textContent = queue.length;
}

/* ====== TTS LOOP ====== */
setInterval(async () => {
  if (!audioEnabled || !isPlaying || isMuted || isSpeaking || queue.length === 0) return;
  const next = queue.shift();
  document.getElementById("queueLen").textContent = queue.length;
  const text = document.getElementById("readUsername").checked ? `${next.username} says ${next.message}` : next.message;
  isSpeaking = true;
  document.getElementById("speakingNow").textContent = next.username;

  if (ttsEngine === "speechify" && speechifyApiKey) {
    // Speechify logic here (Placeholder for brevity, can add full fetch if needed)
    isSpeaking = false; 
  } else {
    const utter = new SpeechSynthesisUtterance(text);
    utter.volume = volume; utter.rate = rate;
    const vName = next.platform === "kick" ? document.getElementById("kickVoice").value : document.getElementById("timerVoice").value;
    utter.voice = voices.find(v => v.name === vName);
    utter.onend = () => { isSpeaking = false; document.getElementById("speakingNow").textContent = "None"; };
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  }
}, 100);

/* ====== BUTTON EVENTS ====== */
document.getElementById("enableAudioBtn").onclick = () => {
  audioEnabled = true;
  speechSynthesis.speak(new SpeechSynthesisUtterance("Audio active"));
};
document.getElementById("testTtsBtn").onclick = () => addMessage({platform:"kick", username:"System", message:"Testing the Jailex HUD."});
