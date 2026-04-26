module.exports = {
    command: 'genconvert',
    alias: ['convert'],
    description: 'Convert code language',
    category: 'generate',
    usage: '.genconvert <source> | <target> | <code>',

    execute: async (sock, m, { args, reply }) => {

        if (!args.length) {
            return reply(`✨ ✪ *XADON AI • CODE CONVERTER* ✪ ✨

📌 Format:
.genconvert <source> | <target> | <code>

Example:
.genconvert javascript | python | console.log("Hi")

> XADON AI`);
        }

        const text = args.join(' ');
        const [source, target, ...rest] = text.split('|');

        if (!source || !target || !rest.length) {
            return reply('⚠️ Invalid format');
        }

        const code = rest.join('|').trim();

        await reply('⏳ Converting code...');

        try {
            const url = `https://apis.prexzyvilla.site/ai/convertcode?code=${encodeURIComponent(code)}&source=${encodeURIComponent(source.trim())}&target=${encodeURIComponent(target.trim())}`;

            const res = await fetch(url);
            const data = await res.json();

            const result = data.result || data.code;

            await sock.sendMessage(m.chat, {
                text: `✨ *CODE CONVERTED*

🔄 ${source} → ${target}

\`\`\`${target}
${result}
\`\`\`

> XADON AI`
            }, { quoted: m });

        } catch (err) {
            reply('❌ Conversion failed');
        }
    }
};