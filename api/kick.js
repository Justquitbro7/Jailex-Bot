export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { chatroomId, token, message } = req.body;

    if (!chatroomId || !token || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const response = await fetch(`https://kick.com/api/v2/messages/send/${chatroomId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token 
            },
            body: JSON.stringify({
                content: message,
                type: 'message'
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            return res.status(response.status).json({ error: errorData });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
