// 1. Listen for the token from setup.html
window.addEventListener('message', (event) => {
  // Security check: ensure the message comes from your own site
  if (event.origin !== window.location.origin) return;

  if (event.data.type === 'TWITCH_TOKEN') {
    const token = event.data.token;
    
    // 2. Save it so the user stays logged in next time
    localStorage.setItem('twitch_access_token', token);
    
    console.log("Jailex Sync: Token received!");
    
    // 3. Start the bot automatically
    startJailexBot(token); 
  }
});

// 4. Auto-login on page refresh if we already have a token
window.addEventListener('DOMContentLoaded', () => {
  const savedToken = localStorage.getItem('twitch_access_token');
  if (savedToken) {
    console.log("Jailex: Found saved token, logging in...");
    startJailexBot(savedToken);
  }
});
