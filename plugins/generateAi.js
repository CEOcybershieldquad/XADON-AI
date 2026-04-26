module.exports = {
    command: 'genai',
    alias: ['gen', 'advanced'],
    description: 'Advanced AI text generator',
    category: 'generate',
    usage: '.genai <mode> | <text>',

    execute: async (sock, m, { args, reply }) => {

        if (!args.length) {
            return reply(`✨ ✪ *XADON AI • ADVANCED AI* ✪ ✨

📌 Format:
.genai <mode> | <text>

Modes:
• chat
• story
• code
• explain

Example:
.genai story | a cyberpunk world

> XADON AI`);
        }

        const text = args.join(' ');
        const [mode, ...rest] = text.split('|');

        if (!mode || !rest.length) {
            return reply('⚠️ Use: .genai <mode> | <text>');
        }

        const prompt = rest.join('|').trim();

        await reply('⏳ Generating response...');

        try {
            const url = `https://apis.prexzyvilla.site/ai/advanced?text=${encodeURIComponent(prompt)}&mode=${encodeURIComponent(mode.trim())}&length=medium&creative=high`;

            const res = await fetch(url);
            const data = await res.json();

            const result = data.result || data.response;

            await sock.sendMessage(m.chat, {
                text: `✨ *XADON AI RESPONSE*

🧠 Mode: ${mode}

${result}

> XADON AI`
            }, { quoted: m });

        } catch (err) {
            reply('❌ AI request failed');
        }
    }
};