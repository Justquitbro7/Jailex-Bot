const KICK_CHATROOM_ID = '92474944';
let lastMessageId = null;

async function fetchKickChat() {
    try {
        const response = await fetch(`https://kick.com/api/v2/channels/${KICK_CHATROOM_ID}/messages`);
        const data = await response.json();
        const messages = data.messages;

        if (messages.length > 0) {
            const newest = messages[messages.length - 1];
            if (newest.id !== lastMessageId) {
                lastMessageId = newest.id;
                addMessage('kick', newest.sender.username, newest.content, '#53fc18');
            }
        }
    } catch (err) {
        console.log("Kick poll error:", err);
    }
}

// Check for new Kick messages every 2 seconds
setInterval(fetchKickChat, 2000);
