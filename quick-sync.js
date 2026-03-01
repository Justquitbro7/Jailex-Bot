/* ====== QUICK SYNC ENGINE ====== */
let kickSocket = null;
let twitchSocket = null;

function updateSyncUI() {
    const kickUser = localStorage.getItem('jx_kick_user');
    const twitchUser = localStorage.getItem('jx_twitch_user');
    document.getElementById("kickActiveUI").style.display = kickUser ? "block" : "none";
    document.getElementById("kickLoginUI").style.display = kickUser ? "none" : "block";
    if (kickUser) document.getElementById("kickDisplayUser").textContent = kickUser;
    document.getElementById("twitchActiveUI").style.display = twitchUser ? "block" : "none";
    document.getElementById("twitchLoginUI").style.display = twitchUser ? "none" : "block";
    if (twitchUser) document.getElementById("twitchDisplayUser").textContent = twitchUser;
}

/* KICK LOGIN/SYNC */
async function loginKick() {
    const user = document.getElementById("kickInput").value.trim();
    if (!user) return;
    localStorage.setItem('jx_kick_user', user);
    updateSyncUI();
    connectKick(user);
}
function logoutKick() {
    localStorage.removeItem('jx_kick_user');
    if (kickSocket) kickSocket.close();
    document.getElementById("kickStatusPill").textContent = "OFFLINE";
    document.getElementById("kickStatusPill").className = "status-pill status-off";
    updateSyncUI();
}
async function connectKick(username) {
    if (!username) return;
    const pill = document.getElementById("kickStatusPill");
    try {
        const res = await fetch(`https://kick.com/api/v2/channels/${username}`);
        const data = await res.json();
        kickSocket = new WebSocket("wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false");
        kickSocket.onopen = () => {
            pill.textContent = "SYNCED"; pill.className = "status-pill status-on";
            kickSocket.send(JSON.stringify({ event: "pusher:subscribe", data: { channel: `chatrooms.${data.chatroom.id}.v2` } }));
        };
        kickSocket.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            if (msg.event === "App\\Events\\ChatMessageEvent") {
                const c = JSON.parse(msg.data);
                window.addMessage({ platform: "kick", username: c.sender.username, message: c.content });
            }
        };
    } catch (e) { console.error("Kick Sync Error", e); }
}

/* TWITCH LOGIN/SYNC */
function loginTwitch() {
    const user = document.getElementById("twitchInput").value.trim();
    if (!user) return;
    localStorage.setItem('jx_twitch_user', user);
    updateSyncUI();
    connectTwitch(user);
}
function logoutTwitch() {
    localStorage.removeItem('jx_twitch_user');
    if (twitchSocket) twitchSocket.close();
    document.getElementById("twitchStatusPill").textContent = "OFFLINE";
    document.getElementById("twitchStatusPill").className = "status-pill status-off";
    updateSyncUI();
}
function connectTwitch(username) {
    if (!username) return;
    const pill = document.getElementById("twitchStatusPill");
    twitchSocket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
    twitchSocket.onopen = () => {
        pill.textContent = "SYNCED"; pill.className = "status-pill status-on";
        twitchSocket.send("NICK justinfan12345");
        twitchSocket.send(`JOIN #${username.toLowerCase()}`);
    };
    twitchSocket.onmessage = (e) => {
        if (e.data.includes("PRIVMSG")) {
            const user = e.data.match(/:(\w+)!/)[1];
            const msg = e.data.split("PRIVMSG")[1].split(":")[1].trim();
            // FIX: Explicitly calling the global addMessage
            window.addMessage({ platform: "twitch", username: user, message: msg });
        }
        if (e.data.startsWith("PING")) twitchSocket.send("PONG :tmi.twitch.tv");
    };
}

updateSyncUI();
connectKick(localStorage.getItem('jx_kick_user'));
connectTwitch(localStorage.getItem('jx_twitch_user'));
