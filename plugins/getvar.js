const { getVar } = require('../Xdncentral/configManager');

module.exports = {
    command: 'getvar',
    category: 'owner',
    ownerOnly: true,

    execute: async (sock, m, { args, reply }) => {

        if (!args.length) {
            return reply('⚠️ Provide variable name\n> XADON AI');
        }

        const key = args[0].toUpperCase();
        const value = getVar(key);

        if (value === undefined) {
            return reply(`❌ Variable *${key}* not found`);
        }

        reply(
`╭─❍ *XADON AI • VARIABLE INFO*
│
│ ✦ Name  : ${key}
│ ✦ Value : ${value}
│ ✦ Type  : ${typeof value}
│
╰───────────────────`
        );
    }
};