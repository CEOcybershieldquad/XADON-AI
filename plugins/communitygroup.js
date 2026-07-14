module.exports = {
    command: 'communitygroup',
    alias: ['cgroup', 'addgrouptocommunity'],
    description: 'Create a new group inside a community',
    category: 'community',
    usage: '.communitygroup <community_jid> <group_name>',

    execute: async (sock, m, { args, reply }) => {
        await sock.sendMessage(m.chat, { react: { text: '👥', key: m.key } });

        const communityJid = args[0];
        const groupName = args.slice(1).join(' ');

        if (!communityJid ||!groupName) {
            return reply(`֎ ✪ *XADON AI • COMMUNITY GROUP* ✪ ֎

🌐 Usage:.communitygroup <community_jid> <group_name>

Examples:
-.communitygroup 1234567890@community Announcements

💡 Create a subgroup inside a community

> ֎`)
        }

        try {
            const group = await sock.communityCreateGroup(groupName, [], communityJid);
            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • GROUP CREATED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Group created inside community

❏◦ Group Name : ${groupName}
❏◦ Group JID : ${group?.jid || 'Created'}
❏◦ Community : ${communityJid}

> ֎`)
        } catch (err) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ ${err.message}

> ֎`)
        }
    }
}