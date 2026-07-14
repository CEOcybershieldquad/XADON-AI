module.exports = {
    command: 'addtocommunity',
    alias: ['communityadd', 'addcommunity'],
    description: 'Add a participant to a community',
    category: 'community',
    usage: '.addtocommunity <community_jid> <user_jid>',

    execute: async (sock, m, { args, reply }) => {
        await sock.sendMessage(m.chat, { react: { text: '👤', key: m.key } });

        const communityJid = args[0];
        const userJid = args[1];

        if (!communityJid ||!userJid) {
            return reply(`֎ ✪ *XADON AI • ADD TO COMMUNITY* ✪ ֎

🌐 Usage:.addtocommunity <community_jid> <user_jid>

Examples:
-.addtocommunity 1234567890@community 2348077134210@s.whatsapp.net

💡 Add member to community

> ֎`)
        }

        try {
            await sock.communityParticipantsUpdate(communityJid, [userJid], 'add');
            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • MEMBER ADDED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ User added to community

❏◦ User : ${userJid}
❏◦ Community: ${communityJid}

> ֎`)
        } catch (err) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ ${err.message}

> ֎`)
        }
    }
}