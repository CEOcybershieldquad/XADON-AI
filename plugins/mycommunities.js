module.exports = {
    command: 'mycommunities',
    alias: ['communities', 'allcommunities', 'clist'],
    description: 'Get all communities you participate in',
    category: 'community',
    usage: '.mycommunities',

    execute: async (sock, m, { reply }) => {
        await sock.sendMessage(m.chat, { react: { text: '🏘️', key: m.key } });

        try {
            const communities = await sock.communityFetchAllParticipating();

            if (!communities || Object.keys(communities).length === 0) {
                await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
                return reply(`֎ ✪ *XADON AI • MY COMMUNITIES* ✪ ֎

🏘️ You are not in any communities

> ֎`)
            }

            const communityList = Object.values(communities);
            const list = communityList.map((comm, i) =>
                ` ${i+1}. ${comm.subject || comm.name || 'Unnamed'}\n ❏◦ JID: ${comm.jid}\n ❏◦ Members: ${comm.size || 'N/A'}`
            ).join('\n\n');

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • MY COMMUNITIES* [${communityList.length}]
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