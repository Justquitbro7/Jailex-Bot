const TWITCH_CLIENT_ID = 'nk06xpus7cc4naiif04xqqamwcf8rz'; 
const REDIRECT_URI = 'https://jailex-bot.vercel.app'; 

function loginWithTwitch() {
    const scope = 'chat:read chat:edit';
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${scope}`;
    window.location.href = authUrl;
}

async function initTwitch() {
    const hash = window.location.hash;
    
    // 1. If there's a token in the URL, grab it and CLEAN the URL immediately
    if (hash.includes('access_token=')) {
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get('access_token');

        // WIPE the URL so it can't loop
        window.history.replaceState({}, document.title, "/");

        if (token) {
            console.log("Token found, fetching ID...");
            fetchTwitchID(token);
        }
        return; 
    }
}

async function fetchTwitchID(token) {
    try {
        const response = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                'Client-ID': TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            const user = data.data[0];
            // Show the result clearly on the screen
            addMessage('twitch', 'Jailex-Bot', `CONNECTED! User: ${user.display_name} | ID: ${user.id}`, '#9146ff');
            
            // Hide the button so you don't click it again
            const btn = document.querySelector('.btn-twitch');
            if (btn) btn.style.display = 'none';
        } else {
            addMessage('twitch', 'System', 'Error: Could not retrieve Twitch ID.', '#ff4b4b');
        }
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

// Start the check as soon as the file loads
initTwitch();
