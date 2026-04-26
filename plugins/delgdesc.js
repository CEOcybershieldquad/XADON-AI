module.exports = {
    command: 'delgdesc',
    alias: ['deletedescription', 'cleardesc', 'deldescription'],
    description: 'Delete group description',
    category: 'group',
    usage: '.delgdesc',

    execute: async (sock, m, { reply }) => {

        if (!m.isGroup)
            return reply('❌ This command works only in groups\n> XADON AI');

        await sock.sendMessage(m.chat, {
            react: { text: "⏳", key: m.key }
        });

        try {

            await sock.groupUpdateDescription(m.chat, '');

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
   *XADON AI • DELETE DESC*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📝 Group description cleared

⚡ Update successful

> XADON AI`
            });

            await sock.sendMessage(m.chat, {
                react: { text: "✅", key: m.key }
            });

        } catch (err) {

            console.error('[DELGDESC ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, {
                react: { text: "❌", key: m.key }
            });

            let msg = '❌ Failed to delete group description\n\n';

            if (err.message?.includes('admin') || err.message?.includes('permission')) {
                msg += '• Bot needs admin rights';
            } else if (err.message?.includes('not-authorized')) {
                msg += '• Bot is not admin in this group';
            } else {
                msg += `• ${err.message || 'Unknown error'}`;
            }

            reply(msg + '\n> XADON AI');
        }
    }
};