module.exports = {
    command: 'aio',
    alias: ['alldl', 'multidl', 'dl'],
    desc: 'Universal downloader (Instagram, Facebook, Twitter, etc.)',
    category: 'downloader',
    usage: '.aio <URL>',

    execute: async (sock, m, { args, reply }) => {
        const url = args[0]?.trim();
        if (!url) {
            return reply('🌟 *Please provide any social media URL!*\n\nExample: `.aio https://instagram.com/...`');
        }

        const loadingMsg = await reply('✪ _*🚀 Fetching video with AIO...*_ ⚡');

        try {
            const res = await axios.get(
                `https://apis.prexzyvilla.site/download/aio?url=${encodeURIComponent(url)}`,
                { timeout: 30000, headers: { 'User-Agent': 'Mozilla/5.0' } }
            );

            const data = res.data?.data || res.data || {};
            const videoUrl = data.video || data.play || data.url || data.download;

            if (!videoUrl) throw new Error('No video found');

            await sock.sendMessage(m.key.remoteJid, { delete: loadingMsg.key });

            const caption = `🎵 *XADON AIO DOWNLOADER*\n` +
                `✦ ───── ⋆⋅☆⋅⋆ ───── ✦\n\n` +
                `*Title:* ${data.title || 'Untitled'}\n` +
                `Platform: ${data.platform || 'Unknown'}\n` +
                `Downloaded by Musteqeem AI ⚡`;

            await sock.sendMessage(m.key.remoteJid, {
                video: { url: videoUrl },
                mimetype: 'video/mp4',
                caption,
                fileName: 'aio-video.mp4'
            }, { quoted: m });

        } catch (err) {
            console.log('[AIO API ERROR]', err.message);
            await sock.sendMessage(m.key.remoteJid, { delete: loadingMsg.key });
            return reply('❌ Failed to download with AIO API.\nTry again later.\n> XADON AI');
        }
    }
};