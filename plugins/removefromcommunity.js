module.exports = {
    command: 'removefromcommunity',
    alias: ['communityremove', 'removecommunity'],
    description: 'Remove a participant from a community',
    category: 'community',
    usage: '.removefromcommunity <community_jid> <user_jid>',

    execute: async (sock, m, { args, reply }) => {
        await sock.sendMessage(m.chat, { react: { text: '🚫', key: m.key } });

        const communityJid = args[0];
        const userJid = args[1];

        if (!communityJid ||!userJid) {
            return reply(`֎ ✪ *XADON AI • REMOVE FROM COMMUNITY* ✪ ֎

🌐 Usage:.removefromcommunity <community_jid> <user_jid>

Examples:
-.removefromcommunity 1234567890@community 2348077134210@s.whatsapp.net

💡 Remove member from community

> ֎`)
        }

        try {
            await sock.communityParticipantsUpdate(communityJid, [userJid], 'remove');
            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • MEMBER REMOVED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ User removed from community

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