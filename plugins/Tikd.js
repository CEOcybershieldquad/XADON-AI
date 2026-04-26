const axios = require('axios');

module.exports = {
    command: 'tiktok',
    alias: ['tt', 'tiktokdl', 'ttdl'],
    desc: 'Download TikTok video without watermark',
    category: 'downloader',
    usage: '.tt <TikTok URL>',
    owner: false,

    execute: async (sock, m, { args, reply }) => {
        const url = args[0]?.trim();
        if (!url || !url.includes('tiktok.com')) {
            return reply(
                '🌟 *Please provide a valid TikTok URL!*\n\n' +
                'Example:\n' +
                '`.tiktok https://www.tiktok.com/@user/video/1234567890`\n' +
                '`.tiktok https://vt.tiktok.com/xadon-ai/`'
            );
        }

        await reply('✪ _*🚀Downloading TikTok video⚡...*_');

        const apis = [
            async () => {
                const res = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`, {
                    timeout: 45000,
                    headers: { 'User-Agent': 'Mozilla/5.0' }
                });
                const data = res.data?.data;
                return {
                    video: data?.play,
                    music: data?.music,
                    title: data?.title,
                    author: data?.author?.unique_id,
                    likes: data?.digg_count
                };
            },

            async () => {
                const res = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`, {
                    timeout: 45000
                });
                const data = res.data;
                return {
                    video: data?.video?.noWatermark,
                    music: data?.music?.play,
                    title: data?.title,
                    author: data?.author?.unique_id,
                    likes: data?.stats?.likeCount
                };
            },

            async () => {
                const res = await axios.get(`https://tiktokdownload.online/api/tiktok?url=${encodeURIComponent(url)}`, {
                    timeout: 45000
                });
                return {
                    video: res.data?.data?.play
                };
            }
        ];

        let result = null;

        for (const api of apis) {
            try {
                const data = await api();
                if (data?.video) {
                    result = data;
                    break;
                }
            } catch (err) {
                console.log('[TIKTOK API FAILED]', err.response?.status || err.message);
            }
        }

        if (!result || !result.video) {
            return reply('✘ All APIs failed. Try again later.');
        }

        const caption =
            `🎵 *✦ ───── ⋆⋅☆⋅⋆ ───── ✦
   *XADON TIKTOK DOWNLOADER v1.0.0*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*\n\n` +
            `Title: ${result.title || 'Untitled'}\n` +
            `Author: @${result.author || 'Unknown'}\n` +
            `Likes: ${result.likes || 'N/A'}\n` +
            `Downloaded by Musteqeem AI`;

        await sock.sendMessage(m.key.remoteJid, {
            video: { url: result.video },
            mimetype: 'video/mp4',
            caption,
            fileName: 'tiktok-video.mp4'
        }, { quoted: m });

        if (result.music) {
            await sock.sendMessage(m.key.remoteJid, {
                audio: { url: result.music },
                mimetype: 'audio/mp4'
            }, { quoted: m });
        }
    }
};
