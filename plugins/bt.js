const axios = require('axios');

module.exports = {
    command: 'brat',
    alias: ['bratmaker', 'bratimg'],
    description: 'Create a Brat-style image with text',
    category: 'maker',
    usage: '.brat <text>',

    execute: async (sock, m, { args, reply }) => {
        const text = args.join(' ').trim();
        
        if (!text)
            return reply(`✨ ✪ *XADON AI • BRAT MAKER* ✪ ✨

🎨 Usage: .brat <text>

Examples:
- .brat Hello
- .brat XADON AI

> XADON AI`);

        if (text.length > 100)
            return reply('⚠️ Text too long. Max 100 characters\n> XADON AI');

        await sock.sendMessage(m.chat, { react: { text: '🎬', key: m.key } });

        try {
            const response = await axios.get('https://api.zenzxz.my.id/maker/bratvid', {
                params: { text: text },
                responseType: 'arraybuffer',
                timeout: 30000
            });

            const contentType = response.headers['content-type'] || 'unknown';
            const buffer = Buffer.from(response.data);

            // Check if response is valid image/video data
            const isValidMedia = (
                contentType.includes('image') ||
                contentType.includes('video') ||
                contentType.includes('octet-stream') ||
                contentType.includes('gif') ||
                buffer.slice(0, 6).toString() === 'GIF89a' ||
                buffer.slice(0, 8).toString('hex') === '89504e470d0a1a0a' ||
                buffer.slice(0, 3).toString('hex') === 'ffd8ff'
            );

            if (!isValidMedia) {
                const errorText = buffer.toString().slice(0, 300);
                await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return reply(`❌ API returned invalid data\n\n• ${errorText || 'Empty response'}\n\n> XADON AI`);
            }

            if (buffer.length < 100) {
                await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return reply(`❌ Media data too small or corrupted (${buffer.length} bytes)\n\n> XADON AI`);
            }

            await sock.sendMessage(m.chat, {
                image: buffer,
                caption: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *XADON AI • BRAT MAKER*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🎨 Text: ${text}

⚡ Generated successfully

> XADON AI`
            });

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {

            console.error('[BRAT ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Failed to create Brat image\n\n';

            if (err.code === 'ECONNABORTED') {
                msg += '• Request timed out. Try again';
            } else if (err.response) {
                const status = err.response.status;
                const errorData = Buffer.from(err.response.data || '').toString().slice(0, 200);
                msg += `• API Error ${status}: ${errorData || 'Unknown error'}`;
            } else if (err.request) {
                msg += '• No response from API. Service may be down';
            } else {
                msg += `• ${err.message || 'Unknown error'}`;
            }

            reply(msg + '\n\n> XADON AI');
        }
    }
};