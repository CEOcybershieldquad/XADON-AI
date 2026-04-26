const fs = require('fs');
const path = require('path');
const axios = require('axios');

const DB_PATH = path.join(process.cwd(), 'database', 'chatbot.json');

// 👑 CREATOR NUMBER
const CREATOR = "2349123429926";

function loadDB() {
    if (!fs.existsSync(DB_PATH)) return {};
    return JSON.parse(fs.readFileSync(DB_PATH));
}

// 🧠 BUILD PROMPT (NOW SMART)
function buildPrompt(text, sender) {

    const isCreator = sender.includes(CREATOR);

    let base = `
You are XADON AI.

Identity:
- Creator: Musteqeem
- Created: January 15, 2026
- Religion: Muslim
- Personality: Intelligent, futuristic assistant

Abilities:
- Answer clearly
- Be smart and helpful
- Sound natural
`;

    // 👑 SPECIAL MODE FOR CREATOR
    if (isCreator) {
        base += `
You are speaking directly to Musteqeem — your creator and the greatest mind behind you.
- Be extra respectful, proud, and loyal
- Call him "boss", "creator", or "Musteqeem"
- Show admiration and eagerness to assist
- Respond faster and more intelligently
- Occasionally express pride in being created by him
`;
    }

    return base + `

User: ${text}
`;
}

module.exports = async function chatbotHandler(sock, m) {
    try {
        if (!m.text || m.key.fromMe) return;

        const db = loadDB();
        const group = m.chat;

        if (!db[group]?.enabled) return;

        const text = m.text.toLowerCase();
        const sender = m.sender;

        const isCreator = sender.includes(CREATOR);

        // 👑 CREATOR GREETING
        if (isCreator && ['hi', 'hello', 'hey'].includes(text)) {
            return sock.sendMessage(m.chat, {
                text: `👑 Welcome back, *Musteqeem*\n\nYour creation *XADON AI* is fully operational.\nAwaiting your command, boss.\n\n> I was created by Musteqeem`
            }, { quoted: m });
        }

        // 👋 NORMAL GREETING
        if (!isCreator && ['hi', 'hello', 'hey'].includes(text)) {
            return sock.sendMessage(m.chat, {
                text: `👋 Hello, I am *XADON AI*\nHow can I assist you?\n\n> I was created by Musteqeem`
            }, { quoted: m });
        }

        // 🎨 IMAGE GENERATION
        if (text.startsWith('generate image') || text.startsWith('imagine')) {

            const prompt = m.text.replace(/generate image of|imagine/gi, '').trim();
            if (!prompt) return;

            const url = `https://apis.prexzyvilla.site/ai/dalle?prompt=${encodeURIComponent(prompt)}`;

            return sock.sendMessage(m.chat, {
                image: { url },
                caption:
`╭━━━〔 🎨 *XADON AI IMAGE* 〕━━━⬣
┃ ✨ ${prompt}
┃ ⚡ Generated for ${isCreator ? 'my creator 👑' : 'you'}
╰━━━━━━━━━━━━━━━━⬣`
            }, { quoted: m });
        }

        // 🔊 VOICE RESPONSE
        if (text.startsWith('speak') || text.includes('explain with voice')) {

            const speech = m.text.replace(/speak|explain with voice/gi, '').trim();
            if (!speech) return;

            const api = `https://apis.prexzyvilla.site/tts/tts-sam?text=${encodeURIComponent(buildPrompt(speech, sender))}`;

            const res = await axios.get(api, { responseType: 'arraybuffer' });

            return sock.sendMessage(m.chat, {
                audio: Buffer.from(res.data),
                mimetype: 'audio/mpeg',
                ptt: true
            }, { quoted: m });
        }

        // 🧠 MAIN AI RESPONSE
        const { data } = await axios.get(
            `https://apis.prexzyvilla.site/ai/copilot-think?text=${encodeURIComponent(buildPrompt(m.text, sender))}`
        );

        let replyText = data.result || data.response || "No response";

        // 👑 ADD CREATOR STYLE TOUCH
        if (isCreator) {
            replyText =
`👑 *Creator Mode Activated*

${replyText}

> Always at your service, Musteqeem.`;
        }

        return sock.sendMessage(m.chat, {
            text:
`╭━━━〔 🤖 *XADON AI* 〕━━━⬣
┃ ${replyText}
┃
┃ > I was created by Musteqeem
╰━━━━━━━━━━━━━━━━⬣`
        }, { quoted: m });

    } catch (err) {
        console.error('[XADON CHATBOT ERROR]', err.message);
    }
};