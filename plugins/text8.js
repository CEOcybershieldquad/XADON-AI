module.exports = {
    command: 'xblackpink',
    alias: ['xbpstyle', 'xpink', 'xbp'],
    description: 'Create BLACKPINK style logo text using XADON AI',
    category: 'text',
    usage: '.xblackpink <text>',

    execute: async (sock, m, { args, reply }) => {

        if (!args.length) {
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • BLACKPINK*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🖤💗 Generate BLACKPINK style logo:

Example:
.xblackpink Hello World
.xblackpink XADON AI ֎
.xblackpink BLINK

> ֎`);
        }

        const text = args.join(' ').trim();

        if (text.length > 25) {
            return reply(`❌ Text too long\n\nMax 25 characters allowed\n\n> ֎`);
        }

        await reply(`⏳ Generating BLACKPINK style...\nPlease wait...`);

        try {

            // ✅ Prexzy BLACKPINK Style API
            const apiUrl = `https://apis.prexzyvilla.site/blackpinkstyle?text=${encodeURIComponent(text)}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const contentType = response.headers.get('content-type');

            let imageBuffer;

            // ✅ Handle JSON response
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();

                if (data.error) throw new Error(data.error);

                const imageUrl = data.url || data.image_url || data.result;

                if (!imageUrl) throw new Error('No image returned');

                // fetch actual image
                const imgRes = await fetch(imageUrl);
                const arrBuf = await imgRes.arrayBuffer();
                imageBuffer = Buffer.from(arrBuf);

            } else {
                // ✅ Direct image
                const arrBuf = await response.arrayBuffer();
                imageBuffer = Buffer.from(arrBuf);
            }

            // 🚀 Send image
            await sock.sendMessage(m.chat, {
                image: imageBuffer,
                caption: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • BLACKPINK*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ *Generated Successfully!*

📝 Text: ${text}
🖤💗 Effect: BLACKPINK Style

> ֎`,
                mentions: [m.sender]
            }, { quoted: m });

            // ✅ React
            await sock.sendMessage(m.chat, {
                react: { text: "🖤", key: m.key }
            });

        } catch (err) {

            console.error('[XBLACKPINK ERROR]', err);

            let msg = '❌ BLACKPINK style failed\n\n';

            if (err.message.includes('fetch')) {
                msg += '• Network error';
            } else if (err.message.includes('401')) {
                msg += '• API key required';
            } else if (err.message.includes('429')) {
                msg += '• Rate limited (too many requests)';
            } else if (err.message.includes('500') || err.message.includes('502')) {
                msg += '• API is down. Try later';
            } else {
                msg += `• ${err.message}`;
            }

            reply(msg + '\n\n> ֎');
        }
    }
};