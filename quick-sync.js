/* ====== JAILEX QUICK SYNC ENGINE ====== */
let kickSocket = null;
let twitchSocket = null;

function updateSyncUI() {
    const kickUser = localStorage.getItem('jx_kick_user');
    const twitchUser = localStorage.getItem('jx_twitch_user');
    const kActive = document.getElementById("kickActiveUI");
    const kLogin = document.getElementById("kickLoginUI");
    if (kActive && kLogin) {
        kActive.style.display = kickUser ? "block" : "none";
        kLogin.style.display = kickUser ? "none" : "block";
        if (kickUser) document.getElementById("kickDisplayUser").textContent = kickUser;
    }
    const tActive = document.getElementById("twitchActiveUI");
    const tLogin = document.getElementById("twitchLoginUI");
    if (tActive && tLogin) {
        tActive.style.display = twitchUser ? "block" : "none";
        tLogin.style.display = twitchUser ? "none" : "block";
        if (twitchUser) document.getElementById("twitchDisplayUser").textContent = twitchUser;
    }
}

window.loginKick = async function() {
    const u = document.getElementById("kickInput").value.trim();
    if (u) { localStorage.setItem('jx_kick_user', u); updateSyncUI(); connectKick(u); }
};
window.logoutKick = function() {
    localStorage.removeItem('jx_kick_user'); if (kickSocket) kickSocket.close(); updateSyncUI();
};
async function connectKick(user) {
    const pill = document.getElementById("kickStatusPill");
    try {
        const res = await fetch(`https://kick.com/api/v2/channels/${user}`);
        const data = await res.json();
        kickSocket = new WebSocket("wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false");
        kickSocket.onopen = () => {
            pill.textContent = "SYNCED"; pill.className = "status-pill status-on";
            kickSocket.send(JSON.stringify({ event: "pusher:subscribe", data: { channel: `chatrooms.${data.chatroom.id}.v2` } }));
        };
        kickSocket.onmessage = (e) => {
            const m = JSON.parse(e.data);
            if (m.event === "App\\Events\\ChatMessageEvent") {
                const c = JSON.parse(m.data);
                window.addMessage({ platform: "kick", username: c.sender.username, message: c.content });
            }
        };
    } catch (e) { pill.textContent = "OFFLINE"; }
}

window.loginTwitch = function() {
    const u = document.getElementById("twitchInput").value.trim();
    if (u) { localStorage.setItem('jx_twitch_user', u); updateSyncUI(); connectTwitch(u); }
};
window.logoutTwitch = function() {
    localStorage.removeItem('jx_twitch_user'); if (twitchSocket) twitchSocket.close(); updateSyncUI();
};
function connectTwitch(user) {
    const pill = document.getElementById("twitchStatusPill");
    twitchSocket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
    twitchSocket.onopen = () => {
        pill.textContent = "SYNCED"; pill.className = "status-pill status-on";
        twitchSocket.send("NICK justinfan12345");
        twitchSocket.send(`JOIN #${user.toLowerCase()}`);
    };
    twitchSocket.onmessage = (e) => {
        if (e.data.includes("PRIVMSG")) {
            const u = e.data.match(/:(\w+)!/)[1];
            const m = e.data.split("PRIVMSG")[1].split(":")[1].trim();
            window.addMessage({ platform: "twitch", username: u, message: m });
        }
        if (e.data.startsWith("PING")) twitchSocket.send("PONG :tmi.twitch.tv");
    };
}
updateSyncUI();
connectKick(localStorage.getItem('jx_kick_user'));
connectTwitch(localStorage.getItem('jx_twitch_user'));
