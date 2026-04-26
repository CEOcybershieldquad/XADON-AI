module.exports = {
    command: 'xclear',
    description: 'Clear last 40 messages including admins',
    category: 'group',
    usage: '.xclear',

    execute: async (sock, m, { reply }) => {
        if (!m.isGroup) return reply('❌ This command works only in groups\n> XADON AI');

        try {
            const messages = await sock.fetchMessages(m.chat, { limit: 40 });

            for (let msg of messages) {
                try {
                    await sock.sendMessage(m.chat, { delete: msg.key });
                } catch {
                    // skip errors (admins or protected messages)
                }
            }

            reply(`💥 Cleared last 40 messages successfully!\n> XADON AI`);

        } catch (err) {
            console.error('[XCLEAR ERROR]', err?.message || err);
            reply('⚠️ Failed to clear messages\n> XADON AI');
        }
    }
};