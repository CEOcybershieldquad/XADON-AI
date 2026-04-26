// Requires: npm install ytdl-core
const ytdl = require('ytdl-core');

module.exports = {
    command: 'ytv',
    aliases: ['ytvideo', 'ytdl'],
    description: 'Download YouTube video (reply or send link)',
    category: 'downloader',

    execute: async (sock, m, { args, reply, text }) => {
        try {
            let url = text.trim();
            if (!url && m.quoted) {
                url = m.quoted.body?.trim() || '';
            }

            if (!url || !ytdl.validateURL(url)) {
                return reply("Send a valid YouTube link!\nExample: !ytv https://youtu.be/xxxx");
            }

            await reply("Downloading video... This may take a while ⏳");

            const info = await ytdl.getInfo(url);
            const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });

            const stream = ytdl.downloadFromInfo(info, { format });

            let buffer = Buffer.alloc(0);
            stream.on('data', chunk => { buffer = Buffer.concat([buffer, chunk]); });
            stream.on('end', async () => {
                await sock.sendMessage(m.chat, {
                    video: buffer,
                    mimetype: 'video/mp4',
                    caption: `Downloaded: *${info.videoDetails.title}*\nBy Musteqeem's Bot 🔥`
                }, { quoted: m });
            });

            stream.on('error', err => {
                reply("Download failed 😭\n" + err.message);
            });

        } catch (err) {
            console.error(err);
            await reply("Error downloading video:\n" + err.message);
        }
    }
};