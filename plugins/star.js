module.exports = {
    command: 'star',
    alias: ['starr', 'favourite', 'bookmark', 'unstar'],
    description: 'Star or unstar a message (reply to it)',
    category: 'utility',
    usage: '.star |.unstar [reply to message]',

    execute: async (sock, m, { reply }) => {
        const isUnstar = m.text?.toLowerCase().startsWith('.unstar');

        if (!m.quoted) {
            return reply(`֎ ✪ *XADON AI • STAR MESSAGE* ✪ ֎

🌐 Usage:.star [reply to message]
🌐 Usage:.unstar [reply to message]

💡 Save or remove messages from starred

> ֎`)
        }

        await sock.sendMessage(m.chat, { react: { text: isUnstar? '💫' : '⭐', key: m.key } });

        try {
            await sock.star(m.chat, [{
                id: m.quoted.key.id,
                fromMe: m.quoted.key.fromMe
            }],!isUnstar);

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • MESSAGE ${isUnstar? 'UNSTARRED' : 'STARRED'}*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Message ${isUnstar? 'removed from' : 'added to'} starred

> ֎`)
        } catch (err) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ ${err.message}

> ֎`)
        }
    }
}