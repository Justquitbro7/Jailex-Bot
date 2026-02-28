const TWITCH_CLIENT_ID = 'nk06xpus7cc4naiif04xqqamwcf8rz'; 
const REDIRECT_URI = 'https://jailex-bot.vercel.app'; 

function loginWithTwitch() {
    const scope = 'chat:read chat:edit';
    window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${scope}`;
}

async function fetchTwitchID(token) {
    const response = await fetch('https://api.twitch.tv/helix/users', {
        headers: { 'Client-ID': TWITCH_CLIENT_ID, 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (data.data[0]) {
        addMessage('Jailex', `SUCCESS! Linked to: ${data.data[0].display_name} (ID: ${data.data[0].id})`);
    }
}
