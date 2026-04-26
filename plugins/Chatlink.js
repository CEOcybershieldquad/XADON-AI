module.exports = {
    command: 'mylink',
    alias: ['chatlink', 'clink', 'dmlink', 'pm'],
    description: 'Get your direct WhatsApp chat link',
    category: 'general',
    usage: '.mylink',

    execute: async (sock, m, { reply }) => {
        try {
            // Only allow in private chat
            if (m.isGroup) {
                await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return reply('❌ Use this command in private chat only\n> ֎');
            }

            await sock.sendMessage(m.chat, { react: { text: '🔗', key: m.key } });

            // Get sender number
            const number = (m.sender || '').split('@')[0];

            if (!number) {
                return reply('❌ Unable to fetch your number\n> ֎');
            }

            // Generate link
            const link = `https://wa.me/${number}`;

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • YOUR DM LINK*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🔗 ${link}

💡 Share this link so anyone can chat you directly

> ֎`);

        } catch (err) {
            console.error('[MYLINK ERROR]', err?.message || err);
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply('❌ Error generating link\n> ֎');
        }
    }
};