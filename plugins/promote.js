module.exports = {
    command: 'promote',
    alias: ['admin'],
    description: 'Promote user to admin',
    category: 'group',
    usage: '.promote @user / reply / number',

    execute: async (sock, m, { args, reply }) => {

        if (!m.isGroup)
            return reply('❌ This command works only in groups\n> XADON AI');

        let target;

        // ✅ 1. Mention
        if (m.mentionedJid?.length) {
            target = m.mentionedJid[0];

        // ✅ 2. Reply
        } else if (m.quoted) {
            target = m.quoted.sender;

        // ✅ 3. Number
        } else if (args[0]) {
            let number = args[0].replace(/[^0-9]/g, '');

            if (number.length < 10)
                return reply('⚠️ Invalid number format\n> XADON AI');

            target = number + '@s.whatsapp.net';

        } else {
            return reply(`✨ ✪ *XADON AI • PROMOTE* ✪ ✨

👑 Ways to promote:

• Reply to user → .promote
• Tag user → .promote @user
• Use number → .promote 234xxxxxxxxxx

> XADON AI`);
        }

        try {

            await sock.groupParticipantsUpdate(m.chat, [target], 'promote');

            const num = target.split('@')[0];

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
      *XADON AI • PROMOTION*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

👑 @${num} is now Admin

⚡ Promotion successful

> XADON AI`,
                mentions: [target]
            });

            await sock.sendMessage(m.chat, {
                react: { text: "👑", key: m.key }
            });

        } catch (err) {

            console.error('[PROMOTE ERROR]', err?.message || err);

            let msg = '❌ Failed to promote\n\n';

            if (err.message?.includes('admin')) {
                msg += '• Bot needs admin rights';
            } else if (err.message?.includes('permission')) {
                msg += '• Permission denied';
            } else {
                msg += `• ${err.message}`;
            }

            reply(msg + '\n> XADON AI');
        }
    }
};