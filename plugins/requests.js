module.exports = {
    command: 'requests',
    alias: ['pending', 'joinlist'],
    description: 'List all pending join requests',
    category: 'group',
    usage: '.requests',

    execute: async (sock, m, { reply }) => {

        if (!m.isGroup)
            return reply('❌ This command works only in groups\n> XADON AI');

        let requests;

        try {
            requests = await sock.groupRequestParticipantsList(m.chat);
        } catch (e) {
            return reply('❌ Failed to fetch join requests\n> XADON AI');
        }

        if (!requests.length)
            return reply('⚠️ No pending join requests\n> XADON AI');

        let text = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
      *XADON AI • REQUESTS*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📋 Pending Users: ${requests.length}\n\n`;

        let mentions = [];

        requests.forEach((u, i) => {
            const num = u.jid.split('@')[0];
            text += `${i + 1}. @${num}\n`;
            mentions.push(u.jid);
        });

        text += `\n⚡ Use .approve or .reject

> XADON AI`;

        await sock.sendMessage(m.chat, {
            text,
            mentions
        });
    }
};