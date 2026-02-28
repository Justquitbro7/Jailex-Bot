// --- JAILEX BOT: MAIN CONNECTION SCRIPT ---

// 1. SETTINGS & UI COLORS (Bears Edition)
const BEARS_ORANGE = "#C83803";
const BEARS_NAVY = "#0B162A";

// 2. TOKEN LISTENER (The "Handshake")
// This waits for setup.html to shout the token back to this window
window.addEventListener('message', (event) => {
    // Only accept messages from your own domain
    if (event.origin !== window.location.origin) return;

    if (event.data.type === 'TWITCH_TOKEN') {
        const token = event.data.token;
        
        // Save to browser memory so you stay logged in
        localStorage.setItem('jailex_twitch_token', token);
        console.log("Jailex: Twitch Sync Successful!");
        
        // Update the UI and start the bot
        updateSyncStatus("Connected", BEARS_ORANGE);
        connectJailexChat(token);
    }
});

// 3. UI UPDATE FUNCTION
function updateSyncStatus(text, color) {
    const statusText = document.getElementById('sync-status');
    if (statusText) {
        statusText.innerText = text;
        statusText.style.color = color;
    }
}

// 4. CHAT CONNECTION (WebSocket)
async function connectJailexChat(token) {
    // First, let's get your Twitch Username using the token
    try {
        const response = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                'Client-ID': 'YOUR_CLIENT_ID_HERE', // PUT YOUR CLIENT ID HERE
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        const username = data.data[0].login;

        console.log(`Jailex: Connecting to chat for ${username}...`);

        // Connect to Twitch IRC
        const socket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

        socket.onopen = () => {
            socket.send(`PASS oauth:${token}`);
            socket.send(`NICK ${username}`);
            socket.send(`JOIN #${username}`);
            console.log("Jailex: Bot is officially in the chat!");
        };

        socket.onmessage = (event) => {
            // This is where chat messages come in!
            console.log("New Message:", event.data);
            // You can add your TTS or Keyword logic here later
        };

    } catch (err) {
        console.error("Jailex: Connection error", err);
        updateSyncStatus("Sync Failed", "red");
    }
}

// 5. AUTO-LOAD ON STARTUP
// If the user refreshes, check if we already have a token saved
window.addEventListener('DOMContentLoaded', () => {
    const savedToken = localStorage.getItem('jailex_twitch_token');
    if (savedToken) {
        console.log("Jailex: Found saved session, auto-connecting...");
        updateSyncStatus("Reconnecting...", BEARS_ORANGE);
        connectJailexChat(savedToken);
    }
});

// 6. SYNC BUTTON TRIGGER
// Make sure your button in index.html has onclick="openSyncPopup()"
function openSyncPopup() {
    const clientId = '/**
 * JAILEX BOT - Main Controller
 * Theme: Bears Edition (Navy & Orange)
 * Features: Auto-Login, Twitch Sync, TTS, Chat Overlay
 */

// --- 1. CONFIGURATION ---
const CLIENT_ID = 'YOUR_TWITCH_CLIENT_ID'; // <--- PASTE YOUR CLIENT ID HERE
const BEARS_ORANGE = "#C83803";
const BEARS_NAVY = "#0B162A";

// --- 2. THE HANDSHAKE (Auto-Login Listener) ---
window.addEventListener('message', (event) => {
    // Only accept messages from your own Vercel domain
    if (event.origin !== window.location.origin) return;

    if (event.data.type === 'TWITCH_TOKEN') {
        const token = event.data.token;
        
        // Save to browser so it stays logged in on refresh
        localStorage.setItem('jailex_twitch_token', token);
        console.log("Jailex: Token Handshake Successful!");
        
        updateUIStatus("Synced", BEARS_ORANGE);
        startJailex(token);
    }
});

// --- 3. START THE BOT ENGINE ---
async function startJailex(token) {
    try {
        // Fetch User Info from Twitch
        const response = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                'Client-ID': CLIENT_ID,
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        const user = data.data[0];

        if (user) {
            console.log(`Jailex: Online as ${user.display_name}`);
            updateUIStatus(`Live: ${user.display_name}`, BEARS_ORANGE);
            
            // Connect to the Chat Socket
            connectToTwitchChat(user.login, token);
        }
    } catch (err) {
        console.error("Jailex Connection Error:", err);
        updateUIStatus("Sync Error", "red");
    }
}

// --- 4. TWITCH CHAT & TTS LOGIC ---
function connectToTwitchChat(username, token) {
    const socket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

    socket.onopen = () => {
        socket.send(`PASS oauth:${token}`);
        socket.send(`NICK ${username}`);
        socket.send(`JOIN #${username}`);
        console.log("Jailex: Connected to IRC Server.");
    };

    socket.onmessage = (event) => {
        const message = event.data;

        // Check for PING to keep connection alive
        if (message.includes('PING :tmi.twitch.tv')) {
            socket.send('PONG :tmi.twitch.tv');
        }

        // Parse Chat Messages
        if (message.includes('PRIVMSG')) {
            const parts = message.split('!');
            const user = parts[0].substring(1);
            const msgContent = message.split('PRIVMSG')[1].split(':')[1];

            console.log(`${user}: ${msgContent}`);
            
            // Trigger TTS for Jailex
            speak(`New message from ${user}: ${msgContent}`);
        }
    };
}

// --- 5. UTILITY FUNCTIONS ---

// Text-to-Speech Function
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
}

// Update UI Text
function updateUIStatus(text, color) {
    const statusEl = document.getElementById('sync-status');
    if (statusEl) {
        statusEl.innerText = text;
        statusEl.style.color = color;
    }
}

// The Popup Trigger (Call this from your Button)
function openTwitchSync() {
    const redirectUri = `${window.location.origin}/setup.html`;
    const scope = 'chat:read chat:edit';
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    
    window.open(authUrl, 'JailexSync', 'width=450,height=600');
}

// --- 6. AUTO-START ON LOAD ---
window.addEventListener('DOMContentLoaded', () => {
    const savedToken = localStorage.getItem('jailex_twitch_token');
    if (savedToken) {
        console.log("Jailex: Restoring session...");
        startJailex(savedToken);
    }
});'; // /**
 * JAILEX BOT - Main Controller
 * Theme: Bears Edition (Navy & Orange)
 * Features: Auto-Login, Twitch Sync, TTS, Chat Overlay
 */

// --- 1. CONFIGURATION ---
const CLIENT_ID = 'YOUR_TWITCH_CLIENT_ID'; // <--- PASTE YOUR CLIENT ID HERE
const BEARS_ORANGE = "#C83803";
const BEARS_NAVY = "#0B162A";

// --- 2. THE HANDSHAKE (Auto-Login Listener) ---
window.addEventListener('message', (event) => {
    // Only accept messages from your own Vercel domain
    if (event.origin !== window.location.origin) return;

    if (event.data.type === 'TWITCH_TOKEN') {
        const token = event.data.token;
        
        // Save to browser so it stays logged in on refresh
        localStorage.setItem('jailex_twitch_token', token);
        console.log("Jailex: Token Handshake Successful!");
        
        updateUIStatus("Synced", BEARS_ORANGE);
        startJailex(token);
    }
});

// --- 3. START THE BOT ENGINE ---
async function startJailex(token) {
    try {
        // Fetch User Info from Twitch
        const response = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                'Client-ID': CLIENT_ID,
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        const user = data.data[0];

        if (user) {
            console.log(`Jailex: Online as ${user.display_name}`);
            updateUIStatus(`Live: ${user.display_name}`, BEARS_ORANGE);
            
            // Connect to the Chat Socket
            connectToTwitchChat(user.login, token);
        }
    } catch (err) {
        console.error("Jailex Connection Error:", err);
        updateUIStatus("Sync Error", "red");
    }
}

// --- 4. TWITCH CHAT & TTS LOGIC ---
function connectToTwitchChat(username, token) {
    const socket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

    socket.onopen = () => {
        socket.send(`PASS oauth:${token}`);
        socket.send(`NICK ${username}`);
        socket.send(`JOIN #${username}`);
        console.log("Jailex: Connected to IRC Server.");
    };

    socket.onmessage = (event) => {
        const message = event.data;

        // Check for PING to keep connection alive
        if (message.includes('PING :tmi.twitch.tv')) {
            socket.send('PONG :tmi.twitch.tv');
        }

        // Parse Chat Messages
        if (message.includes('PRIVMSG')) {
            const parts = message.split('!');
            const user = parts[0].substring(1);
            const msgContent = message.split('PRIVMSG')[1].split(':')[1];

            console.log(`${user}: ${msgContent}`);
            
            // Trigger TTS for Jailex
            speak(`New message from ${user}: ${msgContent}`);
        }
    };
}

// --- 5. UTILITY FUNCTIONS ---

// Text-to-Speech Function
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
}

// Update UI Text
function updateUIStatus(text, color) {
    const statusEl = document.getElementById('sync-status');
    if (statusEl) {
        statusEl.innerText = text;
        statusEl.style.color = color;
    }
}

// The Popup Trigger (Call this from your Button)
function openTwitchSync() {
    const redirectUri = `${window.location.origin}/setup.html`;
    const scope = 'chat:read chat:edit';
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    
    window.open(authUrl, 'JailexSync', 'width=450,height=600');
}

// --- 6. AUTO-START ON LOAD ---
window.addEventListener('DOMContentLoaded', () => {
    const savedToken = localStorage.getItem('jailex_twitch_token');
    if (savedToken) {
        console.log("Jailex: Restoring session...");
        startJailex(savedToken);
    }
});
    const redirectUri = `${window.location.origin}/setup.html`;
    const scope = 'chat:read chat:edit';
    
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    
    window.open(authUrl, 'TwitchSync', 'width=4
