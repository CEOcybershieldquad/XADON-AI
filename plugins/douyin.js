module.exports = {
    command: 'douyin',
    alias: ['dy', 'douyindl'],
    desc: 'Download Douyin video without watermark',
    category: 'downloader',
    usage: '.douyin <Douyin URL>',

    execute: async (sock, m, { args, reply }) => {
        const url = args[0]?.trim();
        if (!url || !url.includes('douyin.com')) {
            return reply(
                '🌟 *Please provide a valid Douyin URL!*\n\n' +
                'Example:\n' +
                '`.douyin https://www.douyin.com/video/1234567890`'
            );
        }

        const loadingMsg = await reply('✪ _*🚀 Downloading Douyin video...*_ ⚡');

        try {
            const res = await axios.get(
                `https://apis.prexzyvilla.site/download/douyin?url=${encodeURIComponent(url)}`,
                { timeout: 30000, headers: { 'User-Agent': 'Mozilla/5.0' } }
            );

            const data = res.data?.data || res.data || {};
            const videoUrl = data.video || data.play || data.url || data.download;

            if (!videoUrl) throw new Error('No video found');

            await sock.sendMessage(m.key.remoteJid, { delete: loadingMsg.key });

            const caption = `🎵 *XADON DOUYIN DOWNLOADER*\n` +
                `✦ ───── ⋆⋅☆⋅⋆ ───── ✦\n\n` +
                `*Title:* ${data.title || 'Untitled'}\n` +
                `Downloaded by Musteqeem AI ⚡`;

            await sock.sendMessage(m.key.remoteJid, {
                video: { url: videoUrl },
                mimetype: 'video/mp4',
                caption,
                fileName: 'douyin-video.mp4'
            }, { quoted: m });

        } catch (err) {
            console.log('[DOUYIN API ERROR]', err.message);
            await sock.sendMessage(m.key.remoteJid, { delete: loadingMsg.key });
            return reply('❌ Failed to download from Douyin API.\nTry again later.\n> XADON AI');
        }
    }
};