const TWITCH_CLIENT_ID = 'nk06xpus7cc4naiif04xqqamwcf8rz'; 
// HARDWIRED: No forward slash at the end
const REDIRECT_URI = 'https://jailex-bot.vercel.app'; 

function loginWithTwitch() {
    const scope = 'chat:read chat:edit';
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${scope}`;
    window.location.href = authUrl;
}

async function checkTwitchAuth() {
    const hash = window.location.hash;
    
    // 1. If no token is in the URL, don't do anything
    if (!hash.includes('access_token=')) return;

    // 2. If we already finished this session, stop the loop
    if (sessionStorage.getItem('jailex_auth_complete')) return;

    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('access_token');

    if (token) {
        // 3. IMMEDIATELY wipe the URL to kill the loop physically
        window.history.replaceState({}, document.title, "/");
        
        // 4. Lock the session
        sessionStorage.setItem('jailex_auth_complete', 'true');

        console.log("Token captured. Fetching your Twitch ID...");
        
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
                
                // Show the success message in the chat container
                if (typeof addMessage === "function") {
                    addMessage('Jailex-Bot', `SUCCESS! Connected to: ${user.display_name} (ID: ${user.id})`);
                }

                // Hide the login button since we are connected
                const btn = document.getElementById('login-btn');
                if (btn) btn.style.display = 'none';
            }
        } catch (err) {
            console.error("Twitch Fetch Error:", err);
            sessionStorage.removeItem('jailex_auth_complete'); // Let it retry if it failed
        }
    }
}

// Run the check as soon as the script loads
checkTwitchAuth();
