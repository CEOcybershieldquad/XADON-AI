const axios = require('axios');

module.exports = {
    command: 'quote',
    aliases: ['quotes'],
    category: 'fun',
    description: 'Get smart inspirational quote',

    execute: async (sock, m) => {

        let quote = "Stay strong. Keep pushing forward.";
        let author = "Unknown";

        try {
            const res = await axios.get('https://api.quotable.io/random');
            quote = res.data.content;
            author = res.data.author;
        } catch (e) {
            // fallback
            const localQuotes = [
                ["Success starts with self-belief.", "XADON AI"],
                ["Consistency is power.", "XADON AI"],
                ["Focus on growth, not comfort.", "XADON AI"]
            ];
            const pick = localQuotes[Math.floor(Math.random() * localQuotes.length)];
            quote = pick[0];
            author = pick[1];
        }

        const msg = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
   *XADON AI • PRO QUOTE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

💭 "${quote}"

👤 — ${author}

⚡ Stay inspired

> XADON AI`;

        await sock.sendMessage(m.chat, { text: msg }, { quoted: m });
    }
};