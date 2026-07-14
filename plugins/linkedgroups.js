module.exports = {
    command: 'linkedgroups',
    alias: ['communitygroups', 'cgroups'],
    description: 'Get all groups linked to a community',
    category: 'community',
    usage: '.linkedgroups <community_jid>',

    execute: async (sock, m, { args, reply }) => {
        await sock.sendMessage(m.chat, { react: { text: '📋', key: m.key } });

        const jid = args[0];

        if (!jid) {
            return reply(`֎ ✪ *XADON AI • LINKED GROUPS* ✪ ֎

🌐 Usage:.linkedgroups <community_jid>

Examples:
-.linkedgroups 1234567890@community

💡 View all groups in a community

> ֎`)
        }

        try {
            const groups = await sock.communityFetchLinkedGroups(jid);

            if (!groups || groups.length === 0) {
                await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
                return reply(`֎ ✪ *XADON AI • LINKED GROUPS* ✪ ֎

📋 No groups linked to this community

> ֎`)
            }

            const list = groups.map((group, i) =>
                ` ${i+1}. ${group.subject || group.name || group.jid}\n ❏◦ JID: ${group.jid}`
            ).join('\n\n');

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • LINKED GROUPS* [${groups.length}]
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

${list}

> ֎`)
        } catch (err) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ ${err.message}

> ֎`)
        }
    }
}