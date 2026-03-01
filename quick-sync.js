/* ====== JAILEX QUICK-SYNC LOGIC ====== */

function startJailexSync() {
    const kick = document.getElementById('kickInput').value.trim();
    const twitch = document.getElementById('twitchInput').value.trim();

    if (kick) localStorage.setItem('jx_kick_user', kick);
    if (twitch) localStorage.setItem('jx_twitch_user', twitch);

    console.log("JAILEX: Credentials Saved. Re-launching engines...");
    location.reload(); // Refresh to trigger connections with new data
}

window.onload = () => {
    const savedKick = localStorage.getItem('jx_kick_user');
    const savedTwitch = localStorage.getItem('jx_twitch_user');

    if (savedKick) {
        document.getElementById('kickInput').value = savedKick;
        document.getElementById('kickPill').classList.add('active');
        if (typeof connectKick === "function") connectKick(savedKick);
    }

    if (savedTwitch) {
        document.getElementById('twitchInput').value = savedTwitch;
        document.getElementById('twitchPill').classList.add('active');
        if (typeof connectTwitch === "function") connectTwitch(savedTwitch);
    }
    
    document.getElementById('audioPill').classList.add('active');
};
