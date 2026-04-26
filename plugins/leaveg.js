module.exports = {
    command: 'leave',
    alias: ['exit', 'out'],
    description: 'Leave the current WhatsApp group',
    category: 'group',
    usage: '.leave',

    execute: async (sock, m, { reply }) => {
        if (!m.isGroup) {
            return reply('❌ This command works only in groups\n> XADON AI');
        }

        await reply(`⏳ Leaving group...\nPlease wait\n> XADON AI`);

        try {
            await sock.groupLeave(m.chat);

            // Send confirmation in private (since we are leaving the group)
            await sock.sendMessage(sock.user.id.split(':')[0] + '@s.whatsapp.net', {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
      *XADON AI • LEFT GROUP*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Successfully left the group.

> XADON AI`
            });

            // React in the group before leaving (it will still send)
            await sock.sendMessage(m.chat, {
                react: { text: "👋", key: m.key }
            });

        } catch (err) {
            console.error('[LEAVE ERROR]', err?.message || err);

            let msg = '❌ Failed to leave group\n\n';

            const errorText = (err.message || '').toLowerCase();

            if (errorText.includes('not-authorized') || errorText.includes('forbidden')) {
                msg += '• Bot needs to be admin or participant';
            } else {
                msg += `• ${err.message || 'Unknown error'}`;
            }

            reply(msg + '\n> XADON AI');
        }
    }
};