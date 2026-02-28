const TWITCH_CLIENT_ID = 'nk06xpus7cc4naiif04xqqamwcf8rz'; 
const REDIRECT_URI = 'https://jailex-bot.vercel.app'; 

function loginWithTwitch() {
    // We are building the link manually to ensure NO extra slashes or spaces
    const authUrl = "https://id.twitch.tv/oauth2/authorize" +
                    "?client_id=" + TWITCH_CLIENT_ID +
                    "&redirect_uri=" + REDIRECT_URI +
                    "&response_type=token" +
                    "&scope=chat:read+chat:edit";
    
    window.location.href = authUrl;
}

async function checkAuth() {
    const hash = window.location.hash;
    if (hash.includes('access_token=')) {
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get('access_token');

        // Kill the loop immediately
        window.history.replaceState({}, document.title, "/");

        const response = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                'Client-ID': TWITCH_CLIENT_ID,
                'Authorization': 'Bearer ' + token
            }
        });
        const data = await response.json();
        if (data.data && data.data[0]) {
            const user = data.data[0];
            addMessage('Jailex', `SUCCESS! Linked to: ${user.display_name} (ID: ${user.id})`);
            document.getElementById('login-btn').style.display = 'none';
        }
    }
}

checkAuth();
