const axios = require('axios');

module.exports = {
    command: 'mediafire',
    alias: ['mf', 'mfdown', 'mfdl'],
    description: 'Download files from MediaFire links',
    category: 'downloader',
    usage: '.mediafire <url> or reply to link',

    execute: async (sock, m, { args, reply }) => {

        let url = args[0] || m.quoted?.text;

        if (!url)
            return reply(`֎ ✪ *XADON AI • MEDIAFIRE* ✪ ֎

📁 Usage:.mediafire <url>
Or reply to MediaFire link

Example:.mediafire https://www.mediafire.com/file/...

> ֎`);

        if (!url.includes('mediafire.com'))
            return reply('❌ Invalid MediaFire link\n> ֎');

        await sock.sendMessage(m.chat, { react: { text: '🗂️', key: m.key } });

        try {
            const apiUrl = `https://apis.prexzyvilla.site/download/mediafire?url=${encodeURIComponent(url)}`;

            const res = await axios.get(apiUrl, { timeout: 15000 });

            const data = res.data;

            const fileUrl =
                data?.result?.download ||
                data?.result?.url ||
                data?.download ||
                data?.url;

            const fileName =
                data?.result?.filename ||
                data?.filename ||
                data?.result?.name ||
                'mediafire_file';

            const fileSize =
                data?.result?.filesize ||
                data?.filesize ||
                data?.result?.size ||
                '';

            if (!fileUrl) {
                await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return reply('❌ Failed to fetch file from MediaFire\n\n• Link may be invalid or expired\n\n> ֎');
            }

            // Send as document
            await sock.sendMessage(m.chat, {
                document: { url: fileUrl },
                fileName: fileName,
                mimetype: 'application/octet-stream',
                caption: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • MEDIAFIRE DOWNLOAD*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📁 File: ${fileName}
${fileSize? `📊 Size: ${fileSize}\n` : ''}
⚡ Downloaded from MediaFire

> ֎`
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {

            console.error('[MEDIAFIRE ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Failed to download MediaFire file\n\n';

            if (err.code === 'ECONNABORTED') {
                msg += '• Request timed out. Link may be slow';
            } else if (err.response?.status === 404) {
                msg += '• File not found or deleted';
            } else if (err.response?.status === 403) {
                msg += '• Access denied. File may be private';
            } else {
                msg += '• Link invalid or API error';
            }

            reply(msg + '\n\n> ֎');
        }
    }
};