module.exports = {
    command: 'communitydemote',
    alias: ['demotecommunity', 'communityremoveadmin'],
    description: 'Demote a user from community admin',
    category: 'community',
    usage: '.communitydemote <community_jid> <user_jid>',

    execute: async (sock, m, { args, reply }) => {
        await sock.sendMessage(m.chat, { react: { text: '⬇️', key: m.key } });

        const communityJid = args[0];
        const userJid = args[1];

        if (!communityJid ||!userJid) {
            return reply(`֎ ✪ *XADON AI • DEMOTE ADMIN* ✪ ֎

🌐 Usage:.communitydemote <community_jid> <user_jid>

Examples:
-.communitydemote 1234567890@community 2348077134210@s.whatsapp.net

💡 Demote user from community admin

> ֎`)
        }

        try {
            await sock.communityParticipantsUpdate(communityJid, [userJid], 'demote');
            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • ADMIN DEMOTED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ User demoted from community admin

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