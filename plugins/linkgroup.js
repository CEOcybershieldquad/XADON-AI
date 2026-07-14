module.exports = {
    command: 'linkgroup',
    alias: ['attachgroup', 'addgroup'],
    description: 'Link an existing group to a community',
    category: 'community',
    usage: '.linkgroup <community_jid> <group_jid>',

    execute: async (sock, m, { args, reply }) => {
        await sock.sendMessage(m.chat, { react: { text: '🔗', key: m.key } });

        const communityJid = args[0];
        const groupJid = args[1];

        if (!communityJid ||!groupJid) {
            return reply(`֎ ✪ *XADON AI • LINK GROUP* ✪ ֎

🌐 Usage:.linkgroup <community_jid> <group_jid>

Examples:
-.linkgroup 1234567890@community 1234567890-123456@g.us

💡 Attach an existing group to community

> ֎`)
        }

        try {
            await sock.communityLinkGroup(groupJid, communityJid);
            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • GROUP LINKED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Group linked to community

❏◦ Group : ${groupJid}
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