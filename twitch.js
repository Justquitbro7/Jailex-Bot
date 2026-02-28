const TWITCH_CLIENT_ID = 'nk06xpus7cc4naiif04xqqamwcf8rz'; 
const REDIRECT_URI = 'https://jailex-bot.vercel.app'; 

function loginWithTwitch() {
    const scope = 'chat:read chat:edit';
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${scope}`;
    window.location.href = authUrl;
}

async function runJailexAuth() {
    const hash = window.location.hash;
    
    // If we have a token, GRAB IT and CLEAN THE URL immediately
    if (hash.includes('access_token=')) {
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get('access_token');

        // This line KILLS the loop by clearing the address bar
        window.history.replaceState({}, document.title, "/");

        console.log("Token captured. Fetching ID...");
        
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
                // Show the success message and hide the button
                if (typeof addMessage === "function") {
                    addMessage('twitch', 'Jailex', `SUCCESS! Connected to: ${user.display_name} (ID: ${user.id})`, '#9146ff');
                }
                const btn = document.querySelector('.btn-twitch');
                if (btn) btn.style.display = 'none';
            }
        } catch (err) {
            console.error("Auth failed:", err);
        }
    }
}

// Run this once when the page loads
runJailexAuth();
