const { downloadContentFromMessage } = require('@whiskeysockets/baileys')

module.exports = {
    command: 'setbotpp',
    alias: ['setpp', 'setbotpp', 'setppbot', 'setprofilepic'],
    description: 'Change bot profile picture',
    category: 'owner',
    usage: '.setbotpp (reply to image)',

    execute: async (sock, m, { reply }) => {

        if (!m.quoted || !/image/.test((m.quoted.msg || m.quoted).mimetype || ''))
            return reply(`✨ ✪ *XADON AI • SETBOTPP* ✪ ✨

📸 Reply to an image to set it as bot PFP

Usage: .setbotpp

> XADON AI`);

        await sock.sendMessage(m.chat, {
            react: { text: "📸", key: m.key }
        });

        try {

            const quoted = m.quoted;
            
            const stream = await downloadContentFromMessage(
                quoted.msg || quoted,
                'image'
            );

            let buffer = Buffer.from([]);

            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            await sock.updateProfilePicture(sock.user.id, buffer);

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *XADON AI • BOT PROFILE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📸 Bot profile picture updated

⚡ Update successful

> XADON AI`
            });

            await sock.sendMessage(m.chat, {
                react: { text: "✨", key: m.key }
            });

        } catch (err) {

            console.error('[SETBOTPP ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, {
                react: { text: "❌", key: m.key }
            });

            let msg = '❌ Failed to update bot profile picture\n\n';

            if (err.message?.includes('size') || err.message?.includes('format')) {
                msg += '• Invalid image format or size';
            } else {
                msg += `• ${err.message || 'Unknown error'}`;
            }

            reply(msg + '\n> XADON AI');
        }
    }
};
