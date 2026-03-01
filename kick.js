/* ====== KICK ====== */
const KICK_USER = "justquitbro7";
async function initKick() {
    const pill = document.getElementById("kickStatusPill");
    try {
        const res = await fetch(`https://kick.com/api/v2/channels/${KICK_USER}`);
        const data = await res.json();
        const ws = new WebSocket("wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false");
        ws.onopen = () => {
            pill.textContent = "CONNECTED"; pill.className = "status-pill status-on";
            ws.send(JSON.stringify({ event: "pusher:subscribe", data: { channel: `chatrooms.${data.chatroom.id}.v2` } }));
        };
        ws.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            if (msg.event === "App\\Events\\ChatMessageEvent") {
                const c = JSON.parse(msg.data);
                window.addMessage({ platform: "kick", username: c.sender.username, message: c.content });
            }
        };
    } catch (e) { setTimeout(initKick, 5000); }
}
initKick();
