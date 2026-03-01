/* ====== TWITCH CONNECTOR (FULL FILE) ====== */
const TWITCH_CHANNEL_NAME = "justquitbro7";

function initTwitch() {
  const statusPill = document.getElementById("twitchStatusPill");
  const ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

  ws.onopen = () => {
    console.log("Twitch: Socket Connected");
    if (statusPill) {
      statusPill.textContent = "CONNECTED";
      statusPill.className = "status-pill status-on";
    }
    
    // Login anonymously
    ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
    ws.send("NICK justinfan12345");
    ws.send(`JOIN #${TWITCH_CHANNEL_NAME.toLowerCase()}`);
  };

  ws.onmessage = (event) => {
    const rawData = event.data;
    
    // Process standard chat messages (PRIVMSG)
    if (rawData.includes("PRIVMSG")) {
      const userMatch = rawData.match(/:(\w+)!\w+@\w+/);
      const msgMatch = rawData.split("PRIVMSG")[1].split(":")[1];

      if (userMatch && msgMatch) {
        // HANDSHAKE: Send to Audio Engine
        addMessage({
          platform: "twitch",
          username: userMatch[1],
          message: msgMatch.trim()
        });
      }
    }
    
    // Keep connection alive
    if (rawData.startsWith("PING")) {
      ws.send("PONG :tmi.twitch.tv");
    }
  };

  ws.onclose = () => {
    console.log("Twitch: Socket Disconnected");
    if (statusPill) {
      statusPill.textContent = "IDLE";
      statusPill.className = "status-pill status-off";
    }
    setTimeout(initTwitch, 5000);
  };
  
  ws.onerror = (err) => {
    console.error("Twitch Socket Error:", err);
  };
}

// Start Twitch
initTwitch();
