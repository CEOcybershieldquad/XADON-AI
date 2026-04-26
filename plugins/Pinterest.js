const axios = require('axios');

module.exports = {
    command: 'pinterest',
    alias: ['pint', 'pindl', 'pin'],
    description: 'Download Pinterest images/videos',
    category: 'downloader',
    usage: '.pinterest <url> or reply to link',

    execute: async (sock, m, { args, reply, quoted }) => {
        try {
            let url = args[0] || m.quoted?.text;

            if (!url)
                return reply(`֎ ✪ *XADON AI • PINTEREST* ✪ ֎

📌 Usage:.pinterest <url>
Or reply to Pinterest link

Example:.pinterest https://pin.it/...

> ֎`);

            if (!url.includes('pinterest.com') &&!url.includes('pin.it'))
                return reply('❌ Invalid Pinterest link\n> ֎');

            await sock.sendMessage(m.chat, { react: { text: '📌', key: m.key } });

            const apiUrl = `https://apis.prexzyvilla.site/download/pinterest?url=${encodeURIComponent(url)}`;

            const res = await axios.get(apiUrl, { timeout: 15000 });

            const data = res.data;

            // handle formats
            const media =
                data?.result?.video ||
                data?.result?.image ||
                data?.result?.url ||
                data?.url;

            const title =
                data?.result?.title ||
                data?.title ||
                'Pinterest Media';

            if (!media) {
                await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return reply('❌ Failed to fetch media\n\n• Link may be invalid or private\n\n> ֎');
            }

            // detect type
            const isVideo = media.includes('.mp4') || data?.result?.video;

            if (isVideo) {
                await sock.sendMessage(m.chat, {
                    video: { url: media },
                    caption: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • PINTEREST VIDEO*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📌 ${title}

⚡ Downloaded from Pinterest

> ֎`
                }, { quoted: m });
            } else {
                await sock.sendMessage(m.chat, {
                    image: { url: media },
                    caption: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • PINTEREST IMAGE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📌 ${title}

⚡ Downloaded from Pinterest

> ֎`
                }, { quoted: m });
            }

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {

            console.error('[PINTEREST ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Failed to download Pinterest media\n\n';

            if (err.code === 'ECONNABORTED') {
                msg += '• Request timed out. Link may be slow';
            } else if (err.response?.status === 404) {
                msg += '• Pin not found or deleted';
            } else if (err.response?.status === 403) {
                msg += '• Access denied. Pin may be private';
            } else {
                msg += '• Link invalid or API error';
            }

            reply(msg + '\n\n> ֎');
        }
    }
};