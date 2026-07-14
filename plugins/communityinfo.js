module.exports = {
    command: 'communityinfo',
    alias: ['cinfo', 'communitymetadata'],
    description: 'Get detailed information about a community',
    category: 'community',
    usage: '.communityinfo <community_jid>',

    execute: async (sock, m, { args, reply }) => {
        await sock.sendMessage(m.chat, { react: { text: 'ℹ️', key: m.key } });

        const jid = args[0];

        if (!jid) {
            return reply(`֎ ✪ *XADON AI • COMMUNITY INFO* ✪ ֎

🌐 Usage:.communityinfo <community_jid>

Examples:
-.communityinfo 1234567890@community

💡 Get detailed community information

> ֎`)
        }

        try {
            const metadata = await sock.communityMetadata(jid);

            if (!metadata) {
                return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ Community not found

> ֎`)
            }

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • COMMUNITY INFO*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

❏◦ Name : ${metadata.subject || metadata.name || 'N/A'}
❏◦ Desc : ${metadata.description || 'N/A'}
❏◦ JID : ${jid}
❏◦ Members: ${metadata.size || metadata.participants?.length || 'N/A'}
❏◦ Owner : ${metadata.owner || 'N/A'}
❏◦ Groups : ${metadata.linkedGroups?.length || '0'}

💡 Use.linkedgroups to see all groups

> ֎`
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ ${err.message}

> ֎`)
        }
    }
}