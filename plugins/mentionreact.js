module.exports = {
    command: 'mentionreact',
    alias: ['mr'],
    category: 'group',

    execute: async (sock, m, { args, reply }) => {

        if (!m.isGroup) return reply('❌ Group only');

        let db = getMR();
        const chat = m.chat;

        // ✅ MATCH HANDLER STRUCTURE
        if (!db[chat]) {
            db[chat] = {
                enabled: true,
                emoji: '🛡️',
                last: {} // IMPORTANT
            };
        }

        const cfg = db[chat];
        const sub = args[0]?.toLowerCase();

        // ================= MENU =================
        if (!sub) {
            return reply(
`🛡️ *MENTION REACT*

Status: ${cfg.enabled ? 'ON' : 'OFF'}
Emoji: ${cfg.emoji}

Commands:
.on / .off
.setemoji 😎`
            );
        }

        // ================= ON =================
        if (sub === 'on') {
            cfg.enabled = true;
            saveMR(db);
            return reply('✅ Mention React ON');
        }

        // ================= OFF =================
        if (sub === 'off') {
            cfg.enabled = false;
            saveMR(db);
            return reply('❌ Mention React OFF');
        }

        // ================= SET EMOJI =================
        if (sub === 'setemoji') {
            if (!args[1]) return reply('❌ provide emoji');

            cfg.emoji = args[1];
            saveMR(db);

            return reply(`✅ Emoji set to ${cfg.emoji}`);
        }

        return reply('❌ Invalid command');
    }
};