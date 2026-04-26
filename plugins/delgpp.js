module.exports = {
    command: 'delgpp',
    alias: ['removegpp', 'deletegpp', 'rmgpp', 'delgrouppp'],
    description: 'Remove the current group profile picture',
    category: 'group',
    usage: '.delgpp',

    execute: async (sock, m, { reply, isAdmin, isBotAdmin }) => {

        if (!m.isGroup)
            return reply('❌ This command works only in groups\n> XADON AI');

        await sock.sendMessage(m.chat, {
            react: { text: "⏳", key: m.key }
        });

        try {

            await sock.removeProfilePicture(m.chat);

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *XADON AI • DELETE GPP*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🗑️ Group profile picture removed

⚡ Update successful

> XADON AI`
            });

            await sock.sendMessage(m.chat, {
                react: { text: "🗑️", key: m.key }
            });

        } catch (err) {

            console.error('[DELGPP ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, {
                react: { text: "❌", key: m.key }
            });

            let msg = '❌ Failed to remove group profile picture\n\n';

            if (err.message?.includes('not-authorized') || err.message?.includes('admin') || err.message?.includes('permission')) {
                msg += '• Bot needs admin rights';
            } else if (err.message?.includes('no profile') || err.message?.includes('not found')) {
                msg += '• This group has no profile picture set';
            } else if (err.message?.includes('no-id') || err.message?.includes('Illegal')) {
                msg += '• Update your Baileys version';
            } else {
                msg += `• ${err.message || 'Unknown error'}`;
            }

            reply(msg + '\n> XADON AI');
        }
    }
};