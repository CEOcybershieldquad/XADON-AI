module.exports = {
    command: 'setgpp',
    alias: ['setgrouppp', 'setppgroup', 'setppgc'],
    description: 'Set group profile picture - reply to image',
    category: 'group',
    usage: '.setgpp (reply to image)',

    execute: async (sock, m, { reply }) => {

        if (!m.isGroup)
            return reply('❌ This command works only in groups\n> XADON AI');

        if (!m.quoted || !m.quoted.mtype?.includes('image'))
            return reply(`✨ ✪ *XADON AI • SETGPP* ✪ ✨

📸 Reply to an image to set it as group PFP

Usage: .setgpp

> XADON AI`);

        await sock.sendMessage(m.chat, {
            react: { text: "⏳", key: m.key }
        });

        try {

            const buffer = await m.quoted.download();

            await sock.updateProfilePicture(m.chat, buffer);

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
     *XADON AI • GROUP PFP*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📸 Group profile picture updated

⚡ Update successful

> XADON AI`
            });

            await sock.sendMessage(m.chat, {
                react: { text: "✅", key: m.key }
            });

        } catch (err) {

            console.error('[SETGPP ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, {
                react: { text: "❌", key: m.key }
            });

            let msg = '❌ Failed to set group profile picture\n\n';

            if (err.message?.includes('admin') || err.message?.includes('permission')) {
                msg += '• Bot needs admin rights';
            } else if (err.message?.includes('size') || err.message?.includes('format')) {
                msg += '• Invalid image format or size';
            } else {
                msg += `• ${err.message}`;
            }

            reply(msg + '\n> XADON AI');
        }
    }
};