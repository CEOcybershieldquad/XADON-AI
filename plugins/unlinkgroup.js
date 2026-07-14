module.exports = {
    command: 'unlinkgroup',
    alias: ['detachgroup', 'removegroup'],
    description: 'Unlink a group from a community',
    category: 'community',
    usage: '.unlinkgroup <community_jid> <group_jid>',

    execute: async (sock, m, { args, reply }) => {
        await sock.sendMessage(m.chat, { react: { text: '🔓', key: m.key } });

        const communityJid = args[0];
        const groupJid = args[1];

        if (!communityJid ||!groupJid) {
            return reply(`֎ ✪ *XADON AI • UNLINK GROUP* ✪ ֎

🌐 Usage:.unlinkgroup <community_jid> <group_jid>

Examples:
-.unlinkgroup 1234567890@community 1234567890-123456@g.us

💡 Detach a group from community

> ֎`)
        }

        try {
            await sock.communityUnlinkGroup(groupJid, communityJid);
            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • GROUP UNLINKED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Group unlinked from community

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