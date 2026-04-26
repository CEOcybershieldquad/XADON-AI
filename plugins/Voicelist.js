const axios = require('axios');

module.exports = {
    command: 'listvoice',
    alias: ['voicelist'],
    description: 'List available TTS voices',
    category: 'ai',

    execute: async (sock, m, { reply }) => {

        if (!m.chat) return;

        try {

            await sock.sendMessage(m.chat, {
                react: { text: "🎙️", key: m.key }
            });

            const apiUrl = 'https://apis.prexzyvilla.site/tts/tts-voices';

            const { data } = await axios.get(apiUrl, { timeout: 10000 });

            const voices = data?.voices || [];

            if (!voices.length) {
                return reply('❌ No voices found\n> XADON AI');
            }

            // Limit display (clean UI)
            const showLimit = 20;
            const displayVoices = voices.slice(0, showLimit);

            let list = displayVoices.map((v, i) => {
                return `🎧 ${i + 1}. ${v}`;
            }).join('\n');

            let more = '';
            if (voices.length > showLimit) {
                more = `\n\n⚡ +${voices.length - showLimit} more voices available`;
            }

            const message = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
      *XADON AI • VOICE LIST*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

${list}${more}

🎙️ *Usage:*
• .ttsm <number> <text>
• .ttsm 5 Hello world

⚠️ Voices may expire quickly

> XADON AI`;

            reply(message);

        } catch (err) {

            console.error('[VOICE LIST ERROR]', err?.message || err);

            reply(`❌ Failed to fetch voice list

• API may be down
• Try again later

> XADON AI`);
        }
    }
};