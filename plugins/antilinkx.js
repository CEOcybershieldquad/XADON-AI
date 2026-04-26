module.exports = {
    command: 'xantilink',
    alias: ['linkblock'],
    category: 'antis',
    description: 'Advanced Anti-Link system',

    execute: async (sock, m, { args, reply }) => {

        if (!m.isGroup)
            return reply('⛔ Group only');

        global.antilink = global.antilink || {};

        const state = global.antilink[m.chat] || {
            enabled: false,
            action: 'delete',
            warnLimit: 3,
            warns: {}
        };

        const option = args[0]?.toLowerCase();

        // ─── MENU ───
        if (!option) {
            return reply(
`✪ *XADON AI • ANTI-LINK SYSTEM* ✪

🦅 Status: ${state.enabled ? '🟢 ENABLED' : '🔴 DISABLED'}
🛡️ Action: ${state.action}
🐣 Warn Limit: ${state.warnLimit}

🔹 Enable: .antilink on
🔹 Disable: .antilink off
🔹 Set Action: .antilink action <delete/warn/kick>
🔹 Set Warn Limit: .antilink limit <number>

> Links will be automatically detected and handled`
            );
        }

        // ─── ON/OFF ───
        if (option === 'on') {
            state.enabled = true;
        } else if (option === 'off') {
            state.enabled = false;
        }

        // ─── ACTION ───
        else if (option === 'action') {
            const type = args[1]?.toLowerCase();

            if (!['delete', 'warn', 'kick'].includes(type)) {
                return reply('⚠️ Use: delete / warn / kick');
            }

            state.action = type;
        }

        // ─── LIMIT ───
        else if (option === 'limit') {
            const num = parseInt(args[1]);

            if (isNaN(num) || num < 1)
                return reply('⚠️ Enter valid number');

            state.warnLimit = num;
        }

        global.antilink[m.chat] = state;

        reply(
`✪ *XADON AI • UPDATED* ✪

🦅 Status: ${state.enabled ? '🟢 ENABLED' : '🔴 DISABLED'}
🛡️ Action: ${state.action}
🐣 Warn Limit: ${state.warnLimit}

> Settings saved successfully`
        );
    }
};