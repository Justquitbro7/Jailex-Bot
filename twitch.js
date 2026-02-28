const TWITCH_CLIENT_ID = 'nk06xpus7cc4naiif04xqqamwcf8rz'; 
const REDIRECT_URI = 'https://jailex-bot.vercel.app'; 

function loginWithTwitch() {
    const scope = 'chat:read chat:edit';
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${scope}`;
    window.location.href = authUrl;
}

async function getTwitchUser() {
    const hash = window.location.hash;
    if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get('access_token');

        if (token) {
            // THE LOOP BREAKER: This clears the token from the URL bar immediately
            window.history.replaceState({}, document.title, window.location.pathname);

            const response = await fetch('https://api.twitch.tv/helix/users', {
                headers: {
                    'Client-ID': TWITCH_CLIENT_ID,
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            const userName = data.data[0].display_name;
            const userId = data.data[0].id;

            // Hide the connect button since we're done
            const btn = document.querySelector('.btn-twitch');
            if (btn) btn.style.display = 'none';

            if (typeof addMessage === "function") {
                addMessage('twitch', 'Jailex', `Twitch Linked: ${userName} (ID: ${userId})`, '#9146ff');
            }
        }
    }
}

getTwitchUser();
