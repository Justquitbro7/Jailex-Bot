const TWITCH_CLIENT_ID = 'nk06xpus7cc4naiif04xqqamwcf8rz'; 
const REDIRECT_URI = 'https://jailex-bot.vercel.app'; 

function loginWithTwitch() {
    // This starts the process
    const scope = 'chat:read chat:edit';
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${scope}`;
    window.location.href = authUrl;
}

async function checkAuth() {
    const hash = window.location.hash;
    
    // If there is no token in the URL, just stop.
    if (!hash.includes('access_token=')) return;

    // If we already processed this token in this session, stop the loop!
    if (sessionStorage.getItem('jailex_auth_complete')) return;

    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('access_token');

    if (token) {
        // 1. Immediately wipe the URL to prevent the browser from re-reading it
        window.history.replaceState({}, document.title, "/");
        
        // 2. Mark as complete so it CANNOT run again until you refresh manually
        sessionStorage.setItem('jailex_auth_complete', 'true');

        console.log("Token found. Grabbing User ID...");
        
        try {
            const response = await fetch('https://api.twitch.tv/helix/users', {
                headers: {
                    'Client-ID': TWITCH_CLIENT_ID,
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (data.data && data.data[0]) {
                const user = data.data[0];
                // Show the ID clearly
                if (typeof addMessage === "function") {
                    addMessage('twitch', 'Jailex-Bot', `SUCCESS! Linked to: ${user.display_name} (ID: ${user.id})`, '#9146ff');
                }
                // Remove the button
                const btn = document.querySelector('.btn-twitch');
                if (btn) btn.style.display = 'none';
            }
        } catch (err) {
            console.error("Fetch error:", err);
            sessionStorage.removeItem('jailex_auth_complete'); // Let it try again if it actually failed
        }
    }
}

// Run the check immediately
checkAuth();
