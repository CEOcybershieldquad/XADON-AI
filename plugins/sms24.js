const axios = require('axios');

module.exports = {
    command: 'smsnum',
    category: 'vpn',
    description: 'Get SMS24 virtual numbers',

    execute: async (sock, m, { args, reply }) => {

        if (!args[0]) {
            return reply(
`╭━━━〔 ⚠️ *USAGE* 〕━━━⬣
┃ .smsnum country
┃ Example: .sms24 US
╰━━━━━━━━━━━━━━━━⬣`
            );
        }

        const country = args[0];

        try {
            const { data } = await axios.get(
                `https://apis.prexzyvilla.site/vnum/sms24-numbers?country=${country}`
            );

            const nums = data?.numbers || data;

            const formatted = nums.map((n, i) => `│ ${i + 1}. ${n}`).join('\n');

            reply(
`╭━━━〔 📡 *SMS24 (${country.toUpperCase()})* 〕━━━⬣
┃ ✦ Available Numbers
┃ ✦ Count: ${nums.length}
┃
${formatted}
┃
╰━━━━━━━━━━━━━━━━━━━━⬣
> XADON AI ⚡`
            );

        } catch (err) {
            reply('❌ Failed to fetch SMS24 numbers');
        }
    }
};