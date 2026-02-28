// JAILEX BOT CORE - Client ID Baked In
const CLIENT_ID = 'nk06xpus7cc4naiif04xqqamwcf8rz';

function log(msg) {
    console.log("Jailex Log:", msg);
    const debug = document.getElementById('debug-log');
    if (debug) debug.innerHTML += `<div>> ${msg}</div>`;
}

// 1. Listen for the token from the setup.html popup
window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;

    if (event.data.type === 'TWITCH_TOKEN') {
        const token = event.data.token;
        localStorage.setItem('jailex_twitch_token', token);
        log("Token received! Starting bot...");
        connectBot(token);
    }
});

// 2. Open the Twitch Auth Popup
function openTwitchSync() {
    const redirectUri = `${window.location.origin}/setup.html`;
    const scope = encodeURIComponent('chat:read chat:edit');
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    
    log("Opening Twitch Authorization...");
    window.open(authUrl, 'JailexSync', 'width=450,height=600');
}

// 3. Connect to Twitch API & Chat
async function connectBot(token) {
    const status = document.getElementById('sync-status');
    status.innerText = "Status: Connecting...";

    try {
        const res = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                'Client-ID': CLIENT_ID,
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        
        if (data.data && data.data[0]) {
            const user = data.data[0].display_name;
            status.innerText = `Status: Live as ${user}`;
            status.style.color = "#C83803"; // Bears Orange
            log(`Successfully synced as ${user}`);
        }
    } catch (err) {
        log("Connection Error: " + err.message);
        status.innerText = "Status: Sync Failed";
    }
}

// 4. Check for saved session on load
window.addEventListener('DOMContentLoaded', () => {
    const savedToken = localStorage.getItem('jailex_twitch_token');
    if (savedToken) {
        log("Restoring saved session...");
        connectBot(savedToken);
    }
});
