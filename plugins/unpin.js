module.exports = {
    command: 'unpin',
    aliases: ['unpinmsg', 'unstick', 'removepin'],
    description: 'Unpin a replied message or the last pinned message',
    category: 'general',
    usage: '.unpin OR reply .unpin',

    execute: async (sock, m, { reply }) => {
        try {
            if (!m.isGroup) return reply('❌ This command works only in groups\n> XADON AI');

            let keyToUnpin;

            if (m.quoted) {
                keyToUnpin = m.quoted.key;
            } else {
                // fallback: unpin last pinned message
                const messages = await sock.fetchMessages(m.chat, { limit: 20 });
                const pinnedMsg = messages.find(msg => msg.message?.pinned);
                if (!pinnedMsg) return reply('⚠️ No pinned messages found\n> XADON AI');
                keyToUnpin = pinnedMsg.key;
            }

            await sock.sendMessage(m.chat, { pin: false, key: keyToUnpin });

            await sock.sendMessage(m.chat, {
                text: `📌 Message unpinned successfully!\n> XADON AI`,
                mentions: [m.sender]
            });

        } catch (err) {
            console.error('[UNPIN ERROR]', err?.message || err);
            reply('⚠️ Failed to unpin message\n> XADON AI');
        }
    }
};