module.exports = {
    command: 'communityadmin',
    alias: ['promotecommunity', 'communitypromote'],
    description: 'Promote a user to community admin',
    category: 'community',
    usage: '.communityadmin <community_jid> <user_jid>',

    execute: async (sock, m, { args, reply }) => {
        await sock.sendMessage(m.chat, { react: { text: '👑', key: m.key } });

        const communityJid = args[0];
        const userJid = args[1];

        if (!communityJid ||!userJid) {
            return reply(`֎ ✪ *XADON AI • PROMOTE ADMIN* ✪ ֎

🌐 Usage:.communityadmin <community_jid> <user_jid>

Examples:
-.communityadmin 1234567890@community 2348077134210@s.whatsapp.net

💡 Promote user to community admin

> ֎`)
        }

        try {
            await sock.communityParticipantsUpdate(communityJid, [userJid], 'promote');
            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • ADMIN PROMOTED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ User promoted to community admin

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