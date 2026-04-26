module.exports = {
    command: 'members',
    aliases: ['listmembers'],
    description: 'List all group members',
    category: 'group',
    usage: '.members',

    execute: async (sock, m, { reply }) => {
        if (!m.isGroup) return reply('❌ This command works only in groups\n> XADON AI');

        try {
            const groupMetadata = await sock.groupMetadata(m.chat);
            const members = groupMetadata.participants.map(p => p.id.split('@')[0]);
            const memberList = members.map((num, i) => `${i+1}. @${num}`).join('\n');

            await sock.sendMessage(m.chat, {
                text: `✨ ✪ *Group Members* ✪ ✨\n\n${memberList}\n\n> Total: ${members.length}\n> XADON AI`,
                mentions: groupMetadata.participants.map(p => p.id)
            });

        } catch (err) {
            console.error('[MEMBERS ERROR]', err?.message || err);
            reply('⚠️ Failed to fetch members\n> XADON AI');
        }
    }
};