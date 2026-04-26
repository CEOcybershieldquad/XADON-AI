const warnings = {};
let maxWarn = 3;

module.exports = {
    command: 'xwarn',
    alias: ['warning'],
    description: 'Warn user with auto-kick system',
    category: 'group',
    usage: '.warn @user / reply / number',

    execute: async (sock, m, { args, reply }) => {

        if (!m.isGroup)
            return reply('❌ This command works only in groups\n> XADON AI');

        let sub = args[0]?.toLowerCase();

        // =========================
        // ⚙️ SET WARN LIMIT
        // =========================
        if (sub === 'setwarn') {

            let num = parseInt(args[1]);

            if (!num || num < 1)
                return reply('⚠️ Usage: .warn setwarn 3\n> XADON AI');

            maxWarn = num;

            return reply(`⚡ *XADON WARN SYSTEM*

✔ Limit set to ${maxWarn}

🚨 Auto-kick enabled

> XADON AI`);
        }

        // =========================
        // 🔄 RESET WARN
        // =========================
        if (sub === 'resetwarn') {

            let target;

            if (m.mentionedJid?.length) {
                target = m.mentionedJid[0];

            } else if (m.quoted) {
                target = m.quoted.sender;

            } else if (args[1]) {
                let number = args[1].replace(/[^0-9]/g, '');
                if (number.length < 10)
                    return reply('⚠️ Invalid number\n> XADON AI');

                target = number + '@s.whatsapp.net';

            } else {
                return reply('⚠️ Tag / reply / number\n> XADON AI');
            }

            warnings[target] = 0;

            const num = target.split('@')[0];

            return sock.sendMessage(m.chat, {
                text: `🧹 *XADON WARN RESET*

👤 @${num} warnings cleared

⚡ System clean

> XADON AI`,
                mentions: [target]
            });
        }

        // =========================
        // ⚠️ WARN USER (3 WAYS)
        // =========================
        let target;

        // ✅ 1. Mention
        if (m.mentionedJid?.length) {
            target = m.mentionedJid[0];

        // ✅ 2. Reply (and delete message)
        } else if (m.quoted) {
            target = m.quoted.sender;

            // 🗑️ Delete the replied message
            try {
                await sock.sendMessage(m.chat, {
                    delete: m.quoted.key
                });
            } catch {}

        // ✅ 3. Number
        } else if (args[0]) {
            let number = args[0].replace(/[^0-9]/g, '');

            if (number.length < 10)
                return reply('⚠️ Invalid number format\n> XADON AI');

            target = number + '@s.whatsapp.net';

        } else {
            return reply(`⚡ ✪ *XADON WARN SYSTEM* ✪ ⚡

👑 Ways to warn:

• Reply → .warn
• Tag → .warn @user
• Number → .warn 234xxxxxxxxxx

⚙️ Extra:
• Reset → .warn resetwarn @user
• Set → .warn setwarn 5

> XADON AI`);
        }

        if (!warnings[target]) warnings[target] = 0;

        warnings[target]++;

        const userWarn = warnings[target];
        const num = target.split('@')[0];

        // 🚨 AUTO KICK
        if (userWarn >= maxWarn) {

            await sock.groupParticipantsUpdate(m.chat, [target], 'remove');

            delete warnings[target];

            return sock.sendMessage(m.chat, {
                text: `🚨 *XADON SECURITY ALERT*

👤 @${num} exceeded warnings

💀 ACTION: REMOVED

⚠️ LIMIT: ${maxWarn}

> SYSTEM ENFORCED ⚡
> XADON AI`,
                mentions: [target]
            });
        }

        // ⚠️ NORMAL WARN MESSAGE
        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
   *XADON WARNING SYSTEM*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

👤 @${num}

⚠️ WARN: ${userWarn}/${maxWarn}

📡 STATUS: WATCHED
🔐 SECURITY: ACTIVE

❗ Next = Removal

> XADON AI`,
            mentions: [target]
        });

        // ⚡ Reaction
        await sock.sendMessage(m.chat, {
            react: { text: "⚠️", key: m.key }
        });
    }
};