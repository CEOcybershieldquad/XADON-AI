const axios = require('axios');

module.exports = {
    command: 'gensai',
    category: 'generate',
    description: 'Advanced AI generator',

    execute: async (sock, m, { args, reply }) => {

        if (!args.length) {
            return reply(
`╭━━━〔 ⚠️ *USAGE* 〕━━━⬣
┃ .genai your prompt
┃ Example:
┃ .genai write a love poem
╰━━━━━━━━━━━━━━━━⬣`
            );
        }

        const text = encodeURIComponent(args.join(' '));

        try {
            const { data } = await axios.get(
                `https://apis.prexzyvilla.site/ai/advanced?text=${text}&mode=creative&length=medium&creative=1`
            );

            const result = data?.result || data;

            reply(
`╭━━━〔 🧠 *XADON AI RESPONSE* 〕━━━⬣
┃ ✦ Prompt:
┃ ${args.join(' ')}
┃
┃ ✦ Result:
┃ ${result}
┃
╰━━━━━━━━━━━━━━━━━━━━⬣
> Powered by XADON AI ⚡`
            );

        } catch (err) {
            reply('❌ AI request failed');
        }
    }
};