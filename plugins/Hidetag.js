module.exports = {
    command: 'hidetag',
    alias: ['htag', 'silenttag', 'tagall'],
    description: 'Tag everyone silently',
    category: 'group',
    usage: '.hidetag <message>',

    execute: async (sock, m, { args, reply, isAdmin }) => {

        if (!m.isGroup)
            return reply('❌ This command works only in groups\n> XADON AI');

        await sock.sendMessage(m.chat, {
            react: { text: "💬", key: m.key }
        });

        try {
            const metadata = await sock.groupMetadata(m.chat);
            const participants = metadata.participants.map(p => p.id);

            const text = args.join(' ').trim() || '📢 Attention everyone';

            await sock.sendMessage(
                m.chat,
                {
                    text: `
${text}`,
                    mentions: participants
                },
                { quoted: m }
            );

            await sock.sendMessage(m.chat, {
                react: { text: "👀", key: m.key }
            });

        } catch (err) {

            console.error('[HIDETAG ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, {
                react: { text: "❌", key: m.key }
            });

            let msg = '❌ Failed to tag members\n\n';

            if (err.message?.includes('rate')) {
                msg += '• Rate limit - too many mentions. Try again later';
            } else {
                msg += `• ${err.message || 'Unknown error'}`;
            }

            reply(msg + '\n> XADON AI');
        }
    }
};