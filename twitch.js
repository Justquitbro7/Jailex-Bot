/* ====== TWITCH CONNECTOR ====== */
const TWITCH_CHANNEL_NAME = "justquitbro7";

function initTwitch() {
  const statusPill = document.getElementById("twitchStatusPill");
  const ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

  ws.onopen = () => {
    if (statusPill) {
      statusPill.textContent = "Connected";
      statusPill.className = "status-pill status-on";
    }
    
    // Request tags to get IDs/Colors and login anonymously
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
        // SEND TO AUDIO ENGINE & UI
        addMessage({
          platform: "twitch",
          username: userMatch[1],
          message: msgMatch.trim()
        });
      }
    }
    
    // Keep connection alive with heartbeats
    if (rawData.startsWith("PING")) {
      ws.send("PONG :tmi.twitch.tv");
    }
  };

  ws.onclose = () => {
    if (statusPill) {
      statusPill.textContent = "Disconnected";
      statusPill.className = "status-pill status-off";
    }
    setTimeout(initTwitch, 5000);
  };
}

// Fire it up!
initTwitch();
