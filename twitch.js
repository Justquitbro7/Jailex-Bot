const CHANNEL_NAME = 'justquitbro7';

function connectToTwitch() {
    // Note: To read chat anonymously without a token, we use a simple WebSocket
    const socket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

    socket.onopen = () => {
        socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
        socket.send('PASS SCHMOOPIE'); // Anonymous pass
        socket.send(`NICK justinfan${Math.floor(Math.random() * 10000)}`);
        socket.send(`JOIN #${CHANNEL_NAME}`);
        console.log("Twitch Hardwired!");
    };

    socket.onmessage = (event) => {
        if (event.data.includes('PRIVMSG')) {
            const parts = event.data.split('!');
            const username = parts[0].substring(1);
            const message = event.data.split('PRIVMSG')[1].split(':')[1];
            addMessage('twitch', username, message, '#9146ff');
        }
    };
}

connectToTwitch();
