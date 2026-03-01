/* ====== KICK CONNECTOR (BLUEPRINT EDITION) ====== */
const KICK_CHANNEL = "justquitbro7";
let processedKickIds = new Set();

async function connectKick() {
  const statusPill = document.getElementById("kickStatusPill");

  try {
    // Step 1: Get chatroom ID
    const response = await fetch(`https://kick.com/api/v2/channels/${KICK_CHANNEL}`);
    if (!response.ok) throw new Error("Failed to fetch Kick info");
    
    const channelData = await response.json();
    const chatroomId = channelData.chatroom?.id;
    if (!chatroomId) throw new Error("No chatroom ID found");

    console.log("Kick ID Found:", chatroomId);

    // Step 2: Connect to Pusher
    const ws = new WebSocket("wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false");

    ws.onopen = () => {
      console.log("Kick: Connected");
      if (statusPill) {
        statusPill.textContent = "CONNECTED";
        statusPill.className = "status-pill status-on";
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Step 3: Subscribe
      if (data.event === "pusher:connection_established") {
        ws.send(JSON.stringify({
          event: "pusher:subscribe",
          data: { channel: `chatrooms.${chatroomId}.v2` }
        }));
      }

      // Step 4: Process Messages
      if (data.event === "App\\Events\\ChatMessageEvent") {
        const messageData = JSON.parse(data.data);
        const username = messageData.sender?.username || "Unknown";
        const messageId = messageData.id || `${Date.now()}`;

        // Duplicate Check
        if (processedKickIds.has(messageId)) return;
        processedKickIds.add(messageId);
        if (processedKickIds.size > 1000) {
           processedKickIds = new Set(Array.from(processedKickIds).slice(-1000));
        }

        // HANDSHAKE to Engine
        addMessage({
          platform: "kick",
          username: username,
          message: messageData.content || ""
        });
      }
    };

    ws.onclose = () => {
      if (statusPill) {
        statusPill.textContent = "RECONNECTING...";
        statusPill.className = "status-pill status-off";
      }
      setTimeout(connectKick, 5000);
    };

  } catch (error) {
    console.error("Kick Error:", error);
    setTimeout(connectKick, 10000);
  }
}

connectKick();
