const axios = require('axios');

module.exports = {
    command: 'vnumcountries',
    category: 'vpn',
    description: 'Get all available VNUM countries',

    execute: async (sock, m, { reply }) => {
        try {
            const { data } = await axios.get('https://apis.prexzyvilla.site/vnum/veepn-countries');

            const list = data?.countries || data;

            const formatted = list.map((c, i) => `│ ${i + 1}. ${c}`).join('\n');

            reply(
`╭━━━〔 🌍 *VNUM COUNTRIES* 〕━━━⬣
┃ ✦ Available Countries List
┃ ✦ Total: ${list.length}
┃
${formatted}
┃
╰━━━━━━━━━━━━━━━━━━━━⬣
> XADON AI ⚡`
            );

        } catch (err) {
            reply(
`╭━━━〔 ❌ *ERROR* 〕━━━⬣
┃ Failed to fetch countries
┃ Try again later
╰━━━━━━━━━━━━━━━━⬣`
            );
        }
    }
};