/* ====== KICK CONNECTOR (FULL FILE) ====== */
const KICK_USER_NAME = "justquitbro7";

async function initKick() {
  const statusPill = document.getElementById("kickStatusPill");
  
  try {
    // 1. Fetch the Chatroom ID from Kick's API
    const response = await fetch(`https://kick.com/api/v2/channels/${KICK_USER_NAME}`);
    const data = await response.json();
    
    if (!data.chatroom) {
      throw new Error("Chatroom ID not found");
    }
    
    const chatroomId = data.chatroom.id;

    // 2. Connect to the Pusher WebSocket
    const socket = new WebSocket("wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false");

    socket.onopen = () => {
      console.log("Kick: Socket Connected");
      if (statusPill) {
        statusPill.textContent = "CONNECTED";
        statusPill.className = "status-pill status-on";
      }
      
      // Subscribe to the specific chat channel
      socket.send(JSON.stringify({
        event: "pusher:subscribe",
        data: { channel: `chatrooms.${chatroomId}.v2` }
      }));
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      
      // Only process actual chat messages
      if (msg.event === "App\\Events\\ChatMessageEvent") {
        const chatData = JSON.parse(msg.data);
        
        // HANDSHAKE: Send to Audio Engine
        addMessage({
          platform: "kick",
          username: chatData.sender.username,
          message: chatData.content
        });
      }
    };

    socket.onclose = () => {
        console.log("Kick: Socket Disconnected");
        if (statusPill) {
          statusPill.textContent = "DISCONNECTED";
          statusPill.className = "status-pill status-off";
        }
        setTimeout(initKick, 5000); // Reconnect
    };

    socket.onerror = (err) => {
      console.error("Kick Socket Error:", err);
    };

  } catch (err) {
    console.error("Kick Initial Connection Error:", err);
    if (statusPill) {
      statusPill.textContent = "IDLE (ERROR)";
      statusPill.className = "status-pill status-off";
    }
    setTimeout(initKick, 10000);
  }
}

// Start Kick
initKick();
