module.exports = {
    command: 'kick',
    alias: ['remove'],
    description: 'Remove user from group',
    category: 'group',
    usage: '.kick @user / reply / number',

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
            return reply(`✨ ✪ *XADON AI • KICK* ✪ ✨

🚫 Ways to remove:

• Reply → .kick
• Tag → .kick @user
• Number → .kick 234xxxxxxxxxx

> XADON AI`);
        }

        try {

            await sock.groupParticipantsUpdate(m.chat, [target], 'remove');

            const num = target.split('@')[0];

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
      *XADON AI • REMOVAL*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🚫 @${num} has been removed

⚡ Action successful

> XADON AI`,
                mentions: [target]
            });

            await sock.sendMessage(m.chat, {
                react: { text: "❌", key: m.key }
            });

        } catch (err) {

            console.error('[KICK ERROR]', err?.message || err);

            let msg = '❌ Failed to remove user\n\n';

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