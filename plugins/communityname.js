module.exports = {
    command: 'communityname',
    alias: ['cname', 'updatecommunity', 'communitysubject'],
    description: 'Update community name/subject',
    category: 'community',
    usage: '.communityname <community_jid> <new_name>',

    execute: async (sock, m, { args, reply }) => {
        await sock.sendMessage(m.chat, { react: { text: '✏️', key: m.key } });

        const jid = args[0];
        const newName = args.slice(1).join(' ');

        if (!jid ||!newName) {
            return reply(`֎ ✪ *XADON AI • COMMUNITY NAME* ✪ ֎

🌐 Usage:.communityname <community_jid> <new_name>

Examples:
-.communityname 1234567890@community Tech Hub

💡 Change community name/subject

> ֎`)
        }

        try {
            await sock.communityUpdateSubject(jid, newName);
            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • COMMUNITY UPDATED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Community name updated to: ${newName}

> ֎`)
        } catch (err) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ ${err.message}

> ֎`)
        }
    }
}