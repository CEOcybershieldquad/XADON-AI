const axios = require('axios');
const FormData = require('form-data');

module.exports = {
    command: 'ocr',
    alias: ['ocr', 'read'],
    category: 'documents',
    description: 'Extract text from image (OCR)',
    usage: '.scan (reply to image)',
     // ⭐ Reaction config
    reactions: {
        start: '💬',
        success: '🔍'
    },
    

    execute: async (sock, m, { reply }) => {

        if (!m.quoted) return reply('𝐑𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚𝐧 𝐢𝐦𝐚𝐠𝐞');

        const quoted = m.quoted;
        const mtype = quoted.mtype || quoted.type || '';

        if (!mtype.includes('image')) {
            return reply('𝐌𝐚𝐧,𝐈 𝐣𝐮𝐬𝐭 𝐡𝐨𝐩𝐞 𝐦𝐲 𝐛𝐨𝐬𝐬 𝐰𝐚𝐬 𝐡𝐞𝐫𝐞\n 𝐑𝐄𝐏𝐋𝐘 𝐓𝐎 𝐀𝐍 𝐈𝐌𝐀𝐆𝐄!!!');
        }

        try {

            await reply('_✦ Scanning image for text..._');

            const buffer = await quoted.download();
            if (!buffer) return reply('✘ Failed to download image');

            const form = new FormData();
            form.append('apikey', 'K82707468388957');
            form.append('language', 'eng');
            form.append('isOverlayRequired', 'false');
            form.append('file', buffer, { filename: 'scan.jpg' });

            const res = await axios.post(
                'https://api.ocr.space/parse/image',
                form,
                { headers: form.getHeaders(), timeout: 120000 }
            );

            const data = res.data;

            if (!data?.ParsedResults?.[0]?.ParsedText) {
                return reply('✘ No text detected in image');
            }

            const text = data.ParsedResults[0].ParsedText.trim();

            if (!text) return reply('✘ No readable text found');

            await sock.sendMessage(
                m.chat,
                {
                    text: `╭──✰────────✯────\n༆𝐗𝐀𝐃𝐎𝐍 𝐄𝐗𝐓𝐑𝐀𝐂𝐓𝐎𝐑\n╰──────✯─────★───\n${text}`
                },
                { quoted: m }
            );

        } catch (err) {
            console.log('[SCAN ERROR]', err.message);
            reply('✘ OCR scan failed');
        }
    }
};
