module.exports = {
    command: 'gendebug',
    alias: ['fix', 'bug'],
    description: 'Detect bugs in code',
    category: 'generate',
    usage: '.gendebug <code>',

    execute: async (sock, m, { args, reply }) => {

        if (!args.length) {
            return reply(`✨ ✪ *XADON AI • BUG DETECTOR* ✪ ✨

📌 Usage:
.gendebug <code>

Example:
.gendebug console.lo("Hello")

> XADON AI`);
        }

        const code = args.join(' ');

        await reply('⏳ Detecting bugs...');

        try {
            const url = `https://apis.prexzyvilla.site/ai/detectbugs?code=${encodeURIComponent(code)}`;

            const res = await fetch(url);
            const data = await res.json();

            const result = data.result || data.output;

            await sock.sendMessage(m.chat, {
                text: `✨ *BUG ANALYSIS*

${result}

> XADON AI`
            }, { quoted: m });

        } catch (err) {
            reply('❌ Bug detection failed');
        }
    }
};