module.exports = {
    command: 'setgname',
    alias: ['gcname', 'setgcname'],
    description: 'Set group name',
    category: 'group',
    usage: '.setgname <new group name>',

    execute: async (sock, m, { args, reply }) => {

        if (!m.isGroup)
            return reply('❌ This command works only in groups\n> XADON AI');

        const newName = args.join(' ').trim();

        if (!newName)
            return reply(`✨ ✪ *XADON AI • SETGNAME* ✪ ✨

📝 Usage: .setgname <new group name>

Example: .setgname XADON FAMILY

Note: WhatsApp has a 100 character limit

> XADON AI`);

        if (newName.length > 100)
            return reply('⚠️ Group name cannot exceed 100 characters\n> XADON AI');

        try {

            await sock.groupUpdateSubject(m.chat, newName);

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *XADON AI • GROUP NAME*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📝 Group name changed to:
*${newName}*

⚡ Update successful

> XADON AI`
            });

            await sock.sendMessage(m.chat, {
                react: { text: "📝", key: m.key }
            });

        } catch (err) {

            console.error('[SETGNAME ERROR]', err?.message || err);

            let msg = '❌ Failed to change group name\n\n';

            if (err.message?.includes('admin') || err.message?.includes('permission')) {
                msg += '• Bot needs admin rights';
            } else if (err.message?.includes('too long')) {
                msg += '• Name exceeds character limit';
            } else {
                msg += `• ${err.message}`;
            }

            reply(msg + '\n> XADON AI');
        }
    }
};