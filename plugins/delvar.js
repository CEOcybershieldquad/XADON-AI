const { delVar } = require('../../Xdncentral/configManager');

module.exports = {
    command: 'delvar',
    category: 'owner',
    ownerOnly: true,

    execute: async (sock, m, { args, reply }) => {

        if (!args.length) {
            return reply('⚠️ Provide variable name\n> XADON AI');
        }

        const key = args[0].toUpperCase();
        const success = delVar(key);

        if (!success) {
            return reply(`❌ Variable *${key}* not found`);
        }

        reply(
`╭─❍ *XADON AI • VARIABLE DELETED*
│
│ ✦ Name: ${key}
│ ✔ Successfully removed
│
╰───────────────────`
        );
    }
};