const axios = require('axios');

module.exports = {
    command: 'vmsg',
    category: 'vpn',
    description: 'Get SMS messages',

    execute: async (sock, m, { args, reply }) => {

        try {

            const query = args.join(' ').trim();

            if (!query)
            return reply(
`╭━━━〔 ⚠️ *USAGE* 〕━━━⬣
┃ .vmsg country number
┃ Example:
┃ .vmsg US 123456789
╰━━━━━━━━━━━━━━━━⬣`
            );
        }

        const country = args[0];
        const number = args[1];

        try {
            const { data } = await axios.get(
                `https://apis.prexzyvilla.site/vnum/veepn-messages?country=${country}&number=${number}`
            );

            const msgs = data?.messages || data;

            if (!msgs.length) {
                return reply('⚠️ No messages found');
            }

            const formatted = msgs.map((m, i) =>
                `│ ${i + 1}. ${m.text || m}`
            ).join('\n\n');

            reply(
`╭━━━〔 📩 *SMS (${number})* 〕━━━⬣
┃ ✦ Messages Received
┃
${formatted}
┃
╰━━━━━━━━━━━━━━━━━━━━⬣
> XADON AI ⚡`
            );

        } catch (err) {
            reply('❌ Failed to fetch messages');
        }
    }
};