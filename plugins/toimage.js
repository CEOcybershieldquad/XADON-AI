module.exports = {
    command: 'toimg',
    aliases: ['img', 'photo'],
    category: 'media',
    description: 'Convert sticker to image',
    usage: '.toimg (reply to sticker)',

        execute: async (sock, m, { args, reply }) => {
        try {
            if (!m.quoted || !m.quoted.message?.stickerMessage) {
                return extra.reply("Reply to a sticker with .toimg");
            }

            await sock.sendMessage(m.chat, { react: { text: "🖼️", key: m.key } });

            const buffer = await sock.downloadMediaMessage(m.quoted);

            await sock.sendMessage(m.chat, {
                image: buffer,
                caption: "Here is your sticker as image 🖼️"
            }, { quoted: m });

        } catch (err) {
            await extra.reply("Failed to convert sticker 😔");
        }
    }
};