const fetch = require('node-fetch');

module.exports = {
    command: 'createcommunity',
    alias: ['ccommunity', 'newcommunity', 'makecommunity'],
    description: 'Create a new WhatsApp community',
    category: 'community',
    usage: '.createcommunity <name> [description]',

    execute: async (sock, m, { args, reply }) => {
        await sock.sendMessage(m.chat, { react: { text: '🏘️', key: m.key } });

        const name = args[0];
        const description = args.slice(1).join(' ') || '';

        if (!name) {
            return reply(`֎ ✪ *XADON AI • CREATE COMMUNITY* ✪ ֎

🌐 Usage:.createcommunity <name> [description]

Examples:
-.createcommunity My Community
-.createcommunity Tech Hub Best place for devs

💡 Create a new WhatsApp community

> ֎`)
        }

        try {
            const community = await sock.communityCreate(name, description);
            const inviteCode = community?.inviteCode || community?.code;
            const communityLink = `https://chat.whatsapp.com/${inviteCode}`;

            let thumbnail = null;
            try {
                const pp = await sock.profilePictureUrl(m.chat, 'image');
                thumbnail = await fetch(pp).then(r => r.buffer());
            } catch {}

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • COMMUNITY CREATED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

❏◦ Name : ${name}
❏◦ Link : ${communityLink}
❏◦ Desc : ${description || 'WhatsApp Community Invite'}

💡 Share this link to invite members

> ֎`
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {
            console.error('[CREATE COMMUNITY ERROR]', err?.message || err);
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ Failed: ${err.message}

> ֎`)
        }
    }
}