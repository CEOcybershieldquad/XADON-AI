module.exports = {
    command: 'leavecommunity',
    alias: ['lcommunity', 'exitcommunity'],
    description: 'Leave a WhatsApp community',
    category: 'community',
    usage: '.leavecommunity <community_jid>',

    execute: async (sock, m, { args, reply }) => {
        await sock.sendMessage(m.chat, { react: { text: '🚪', key: m.key } });

        const jid = args[0];

        if (!jid ||!jid.includes('@')) {
            return reply(`֎ ✪ *XADON AI • LEAVE COMMUNITY* ✪ ֎

🌐 Usage:.leavecommunity <community_jid>

Examples:
-.leavecommunity 1234567890@community

💡 Exit from a community

> ֎`)
        }

        try {
            await sock.communityLeave(jid);
            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • LEFT COMMUNITY*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Successfully left community

❏◦ JID: ${jid}

> ֎`)
        } catch (err) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ ${err.message}

> ֎`)
        }
    }
}