module.exports = {
    command: 'demote',
    alias: ['unadmin'],
    description: 'Demote admin to normal user',
    category: 'group',
    usage: '.demote @user / reply / number',

    execute: async (sock, m, { args, reply }) => {

        if (!m.isGroup)
            return reply('❌ This command works only in groups\n> XADON AI');

        let target;

        // Mention
        if (m.mentionedJid?.length) {
            target = m.mentionedJid[0];

        // Reply
        } else if (m.quoted) {
            target = m.quoted.sender;

        // Number
        } else if (args[0]) {
            let number = args[0].replace(/[^0-9]/g, '');

            if (number.length < 10)
                return reply('⚠️ Invalid number format\n> XADON AI');

            target = number + '@s.whatsapp.net';

        } else {
            return reply(`✨ ✪ *XADON AI • DEMOTE* ✪ ✨

🚫 Ways to demote:

• Reply → .demote
• Tag → .demote @user
• Number → .demote 234xxxxxxxxxx

> XADON AI`);
        }

        try {

            await sock.groupParticipantsUpdate(m.chat, [target], 'demote');

            const num = target.split('@')[0];

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
      *XADON AI • DEMOTION*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🚫 @${num} is no longer Admin

⚡ Demotion successful

> XADON AI`,
                mentions: [target]
            });

            await sock.sendMessage(m.chat, {
                react: { text: "📉", key: m.key }
            });

        } catch (err) {

            console.error('[DEMOTE ERROR]', err?.message || err);

            let msg = '❌ Failed to demote\n\n';

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