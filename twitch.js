/* ====== TWITCH ====== */
const TWITCH_USER = "justquitbro7";
function initTwitch() {
    const pill = document.getElementById("twitchStatusPill");
    const ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
    ws.onopen = () => {
        pill.textContent = "CONNECTED"; pill.className = "status-pill status-on";
        ws.send("NICK justinfan12345");
        ws.send(`JOIN #${TWITCH_USER.toLowerCase()}`);
    };
    ws.onmessage = (e) => {
        if (e.data.includes("PRIVMSG")) {
            const parts = e.data.split("PRIVMSG")[1].split(":");
            const user = e.data.match(/:(\w+)!/)[1];
            window.addMessage({ platform: "twitch", username: user, message: parts[1].trim() });
        }
        if (e.data.startsWith("PING")) ws.send("PONG :tmi.twitch.tv");
    };
}
initTwitch();
