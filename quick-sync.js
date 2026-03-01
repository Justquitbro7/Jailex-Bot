/* ====== JAILEX QUICK SYNC ENGINE (v1.3.1) ====== */
let kickSocket = null;
let twitchSocket = null;

/**
 * 1. UI SYNC: Updates the visibility of Login vs Active panels
 * and pulls the saved usernames from the browser memory.
 */
function updateSyncUI() {
    const kickUser = localStorage.getItem('jx_kick_user');
    const twitchUser = localStorage.getItem('jx_twitch_user');

    // KICK PANEL TOGGLE
    const kActive = document.getElementById("kickActiveUI");
    const kLogin = document.getElementById("kickLoginUI");
    const kDisplay = document.getElementById("kickDisplayUser");

    if (kActive && kLogin) {
        kActive.style.display = kickUser ? "block" : "none";
        kLogin.style.display = kickUser ? "none" : "block";
        if (kickUser && kDisplay) kDisplay.textContent = kickUser;
    }

    // TWITCH PANEL TOGGLE
    const tActive = document.getElementById("twitchActiveUI");
    const tLogin = document.getElementById("twitchLoginUI");
    const tDisplay = document.getElementById("twitchDisplayUser");

    if (tActive && tLogin) {
        tActive.style.display = twitchUser ? "block" : "none";
        tLogin.style.display = twitchUser ? "none" : "block";
        if (twitchUser && tDisplay) tDisplay.textContent = twitchUser;
    }
}

/**
 * 2. KICK PROTOCOL: Handles Pusher WebSocket connection
 */
window.loginKick = async function() {
    const input = document.getElementById("kickInput");
    const user = input ? input.value.trim() : "";
    if (!user) return alert("Please enter a Kick username.");
    
    localStorage.setItem('jx_kick_user', user);
    updateSyncUI();
    connectKick(user);
};

window.logoutKick = function() {
    localStorage.removeItem('jx_kick_user');
    if (kickSocket) kickSocket.close();
    const pill = document.getElementById("kickStatusPill");
    if (pill) {
        pill.textContent = "OFFLINE";
        pill.className = "status-pill status-off";
    }
    updateSyncUI();
};

async function connectKick(username) {
    if (!username) return;
    const pill = document.getElementById("kickStatusPill");
    
    try {
        const res = await fetch(`https://kick.com/api/v2/channels/${username}`);
        const data = await res.json();
        
        kickSocket = new WebSocket("wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false");
        
        kickSocket.onopen = () => {
            if (pill) {
                pill.textContent = "SYNCED"; 
                pill.className = "status-pill status-on";
            }
            kickSocket.send(JSON.stringify({ 
                event: "pusher:subscribe", 
                data: { channel: `chatrooms.${data.chatroom.id}.v2` } 
            }));
        };
        
        kickSocket.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            if (msg.event === "App\\Events\\ChatMessageEvent") {
                const c = JSON.parse(msg.data);
                window.addMessage({ 
                    platform: "kick", 
                    username: c.sender.username, 
                    message: c.content 
                });
            }
        };
    } catch (e) { 
        console.error("Kick Sync Error", e);
        if (pill) pill.textContent = "SYNC ERROR";
    }
}

/**
 * 3. TWITCH PROTOCOL: Handles IRC WebSocket connection
 */
window.loginTwitch = function() {
    const input = document.getElementById("twitchInput");
    const user = input ? input.value.trim() : "";
    if (!user) return alert("Please enter a Twitch username.");
    
    localStorage.setItem('jx_twitch_user', user);
    updateSyncUI();
    connectTwitch(user);
};

window.logoutTwitch = function() {
    localStorage.removeItem('jx_twitch_user');
    if (twitchSocket) twitchSocket.close();
    const pill = document.getElementById("twitchStatusPill");
    if (pill) {
        pill.textContent = "OFFLINE";
        pill.className = "status-pill status-off";
    }
    updateSyncUI();
};

function connectTwitch(username) {
    if (!username) return;
    const pill = document.getElementById("twitchStatusPill");
    
    twitchSocket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
    
    twitchSocket.onopen = () => {
        if (pill) {
            pill.textContent = "SYNCED"; 
            pill.className = "status-pill status-on";
        }
        twitchSocket.send("NICK justinfan12345");
        twitchSocket.send(`JOIN #${username.toLowerCase()}`);
    };
    
    twitchSocket.onmessage = (e) => {
        if (e.data.includes("PRIVMSG")) {
            const user = e.data.match(/:(\w+)!/)[1];
            const msg = e.data.split("PRIVMSG")[1].split(":")[1].trim();
            window.addMessage({ 
                platform: "twitch", 
                username: user, 
                message: msg 
            });
        }
        if (e.data.startsWith("PING")) twitchSocket.send("PONG :tmi.twitch.tv");
    };
}

// 4. AUTO-STARTUP
updateSyncUI();
connectKick(localStorage.getItem('jx_kick_user'));
connectTwitch(localStorage.getItem('jx_twitch_user'));
