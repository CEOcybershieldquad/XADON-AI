const { allVars } = require('../Xdncentral/configManager');

module.exports = {
    command: 'listvar',
    alias: ['vars'],
    category: 'owner',
    ownerOnly: true,

    execute: async (sock, m, { reply }) => {

        const vars = allVars();

        if (!Object.keys(vars).length) {
            return reply('⚠️ No variables set\n> XADON AI');
        }

        const list = Object.entries(vars)
            .map(([k, v]) => `│ • ${k} = ${v}`)
            .join('\n');

        reply(
`╭─❍ *XADON AI • ALL VARIABLES*
│
${list}
│
╰───────────────────`
        );
    }
};