module.exports = {
    command: 'genexplain',
    alias: ['explain'],
    description: 'Explain code using XADON AI',
    category: 'generate',
    usage: '.genexplain <language> | <code>',

    execute: async (sock, m, { args, reply }) => {

        if (!args.length) {
            return reply(`✨ ✪ *XADON AI • CODE EXPLAINER* ✪ ✨

📌 Format:
.genexplain <language> | <code>

Example:
.genexplain javascript | console.log("Hello")

> XADON AI`);
        }

        const text = args.join(' ');
        const [lang, ...rest] = text.split('|');

        if (!lang || !rest.length) {
            return reply('⚠️ Use: .genexplain <language> | <code>');
        }

        const code = rest.join('|').trim();

        await reply('⏳ Explaining code...');

        try {
            const url = `https://apis.prexzyvilla.site/ai/explaincode?code=${encodeURIComponent(code)}&lang=${encodeURIComponent(lang.trim())}`;

            const res = await fetch(url);
            const data = await res.json();

            const result = data.result || data.explanation;

            await sock.sendMessage(m.chat, {
                text: `✨ *CODE EXPLANATION*

💻 Language: ${lang}

📜 Explanation:
${result}

> XADON AI`
            }, { quoted: m });

        } catch (err) {
            reply('❌ Failed to explain code');
        }
    }
};