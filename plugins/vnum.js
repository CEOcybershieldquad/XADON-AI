const axios = require('axios');

module.exports = {
    command: 'vnum',
    category: 'vpn',
    description: 'Get virtual numbers by country',

    execute: async (sock, m, { args, reply }) => {

        if (!args[0]) {
            return reply(
`╭━━━〔 ⚠️ *USAGE* 〕━━━⬣
┃ .vnum country
┃ Example: .vnum US
╰━━━━━━━━━━━━━━━━⬣`
            );
        }

        const country = args[0];

        try {
            const { data } = await axios.get(`https://apis.prexzyvilla.site/vnum/veepn-numbers?country=${country}`);

            const nums = data?.numbers || data;

            const formatted = nums.map((n, i) => `│ ${i + 1}. ${n}`).join('\n');

            reply(
`╭━━━〔 📱 *VNUM (${country.toUpperCase()})* 〕━━━⬣
┃ ✦ Available Numbers
┃ ✦ Count: ${nums.length}
┃
${formatted}
┃
╰━━━━━━━━━━━━━━━━━━━━⬣
> XADON AI ⚡`
            );

        } catch (err) {
            reply('❌ Failed to fetch numbers');
        }
    }
};