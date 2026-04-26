const { setVar, getVar, allVars } = require('../Xdncentral/configManager');

module.exports = {
    command: 'setvar',
    alias: ['setconfig'],
    category: 'owner',
    description: 'Manage bot runtime variables (No restart required)',
    ownerOnly: true,

    reactions: {
        start: '⚙️',
        success: '✅',
        error: '❌'
    },

    execute: async (sock, m, { args, reply }) => {

        // 🌌 SHOW MENU
        if (!args.length) {

            const vars = allVars();

            const list = Object.keys(vars).length
                ? Object.entries(vars)
                    .map(([k, v]) => `│ • ${k} = ${v}`)
                    .join('\n')
                : '│ • No variables set yet';

            return reply(
`╭─❍ *XADON AI • CONFIG MANAGER* ⚙️
│
│ ✦ Control bot variables in real-time
│ ✦ No restart required
│
├─❍ *USAGE*
│ • .setvar VARIABLE=VALUE
│
├─❍ *EXAMPLES*
│ • .setvar PREFIX=!
│ • .setvar BOT_NAME=XADON
│ • .setvar GROQ_API_KEY=your_key
│
├─❍ *CURRENT VARIABLES*
${list}
│
╰───────────────────`
            );
        }

        // 📥 PARSE INPUT
        const input = args.join(' ');
        const match = input.match(/^([A-Za-z0-9_]+)=(.+)$/);

        if (!match) {
            return reply(
`╭─❍ *XADON AI • ERROR* ❌
│
│ ✘ Invalid format!
│
│ ✔ Correct Usage:
│ • .setvar VARIABLE=VALUE
│
│ ✦ Example:
│ • .setvar PREFIX=!
│
╰───────────────────`
            );
        }

        const [, varName, value] = match;
        const key = varName.toUpperCase();

        try {

            const saved = setVar(key, value);

            await reply(
`╭─❍ *XADON AI • VARIABLE UPDATED* ✅
│
│ ✦ Variable : ${key}
│ ✦ Value    : ${saved}
│ ✦ Type     : ${typeof saved}
│
├─❍ *STATUS*
│ ✔ Saved Successfully
│ ✔ Database Updated
│ ✔ No Restart Needed
│
╰───────────────────`
            );

        } catch (err) {

            await reply(
`╭─❍ *XADON AI • ERROR* ❌
│
│ ✘ Failed to save variable
│
│ ✦ Reason:
│ ${err.message}
│
╰───────────────────`
            );
        }
    }
};