const TWITCH_CLIENT_ID = 'nk06xpus7cc4naiif04xqqamwcf8rz'; 
const REDIRECT_URI = 'https://jailex-bot.vercel.app'; 

function loginWithTwitch() {
    // This exact URL must be in your Twitch Dev Console "Redirect URLs"
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
            const response = await fetch('https://api.twitch.tv/helix/users', {
                headers: {
                    'Client-ID': TWITCH_CLIENT_ID,
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            const userName = data.data[0].display_name;
            const userId = data.data[0].id;

            if (typeof addMessage === "function") {
                addMessage('twitch', 'Jailex-Bot', `Successfully Linked! ID for ${userName} is: ${userId}`, '#9146ff');
            }
        }
    }
}

getTwitchUser();
