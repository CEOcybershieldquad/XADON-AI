module.exports = {
    command: 'gencode',
    alias: ['code', 'ai-code', 'dev'],
    description: 'Generate code using XADON AI',
    category: 'generate',
    usage: '.gencode <language> | <prompt>',

    execute: async (sock, m, { args, reply }) => {

        if (!args.length) {
            return reply(`✨ ✪ *XADON AI • CODE GENERATOR* ✪ ✨

💻 Generate code instantly:

📌 Format:
.gencode <language> | <prompt>

📍 Examples:
.gencode javascript | whatsapp bot command
.gencode python | simple calculator
.gencode html | portfolio website

> XADON AI`);
        }

        // ✅ Split language and prompt
        const text = args.join(' ');
        const [language, ...rest] = text.split('|');

        if (!language || !rest.length) {
            return reply(`⚠️ Invalid format!

Use:
.gencode <language> | <prompt>

Example:
.gencode javascript | api fetch example`);
        }

        const lang = language.trim();
        const prompt = rest.join('|').trim();

        await reply(`⏳ Generating ${lang} code...\nPlease wait...\n> XADON AI`);

        try {

            // ✅ API URL
            const apiUrl = `https://apis.prexzyvilla.site/ai/prompttocode?prompt=${encodeURIComponent(prompt)}&language=${encodeURIComponent(lang)}`;

            const res = await fetch(apiUrl);

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();

            if (data.error) throw new Error(data.error);

            const code = data.result || data.code || data.output;

            if (!code) throw new Error('No code returned');

            // 🚀 Send nicely formatted
            await sock.sendMessage(m.chat, {
                text: `✨ ✪ *XADON AI • CODE GENERATED* ✪ ✨

💻 Language: *${lang}*

📜 Prompt: ${prompt}

\`\`\`${lang}
${code}
\`\`\`

> XADON AI`,
            }, { quoted: m });

            // ✅ React
            await sock.sendMessage(m.chat, {
                react: { text: "💻", key: m.key }
            });

        } catch (err) {

            console.error('[GENCODE ERROR]', err);

            let msg = '❌ Code generation failed\n\n';

            if (err.message.includes('fetch')) {
                msg += '• Network error';
            } else if (err.message.includes('429')) {
                msg += '• Rate limit exceeded';
            } else {
                msg += `• ${err.message}`;
            }

            reply(msg + '\n> XADON AI');
        }
    }
};