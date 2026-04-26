module.exports = {
    command: 'capcut',
    alias: ['cc', 'capcutdl'],
    desc: 'Download CapCut video/template without watermark',
    category: 'downloader',
    usage: '.capcut <CapCut URL>',

    execute: async (sock, m, { args, reply }) => {
        const url = args[0]?.trim();
        if (!url || !url.includes('capcut.com')) {
            return reply(
                '🌟 *Please provide a valid CapCut URL!*\n\n' +
                'Example:\n' +
                '`.capcut https://www.capcut.com/...`'
            );
        }

        const loadingMsg = await reply('✪ _*🚀 Downloading CapCut video...*_ ⚡');

        try {
            const res = await axios.get(
                `https://apis.prexzyvilla.site/download/capcut?url=${encodeURIComponent(url)}`,
                { timeout: 30000, headers: { 'User-Agent': 'Mozilla/5.0' } }
            );

            const data = res.data?.data || res.data || {};
            const videoUrl = data.video || data.play || data.url || data.download;

            if (!videoUrl) throw new Error('No video found');

            await sock.sendMessage(m.key.remoteJid, { delete: loadingMsg.key });

            const caption = `🎵 *XADON CAPCUT DOWNLOADER*\n` +
                `✦ ───── ⋆⋅☆⋅⋆ ───── ✦\n\n` +
                `*Title:* ${data.title || 'Untitled'}\n` +
                `Downloaded by Musteqeem AI ⚡`;

            await sock.sendMessage(m.key.remoteJid, {
                video: { url: videoUrl },
                mimetype: 'video/mp4',
                caption,
                fileName: 'capcut-video.mp4'
            }, { quoted: m });

        } catch (err) {
            console.log('[CAPCUT API ERROR]', err.message);
            await sock.sendMessage(m.key.remoteJid, { delete: loadingMsg.key });
            return reply('❌ Failed to download from CapCut API.\nTry again later.\n> XADON AI');
        }
    }
};