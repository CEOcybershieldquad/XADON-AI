module.exports = {
    command: 'xbplogo',
    alias: ['xbp', 'xpinkblack', 'xblinktext'],
    description: 'Create BLACKPINK logo text using XADON AI',
    category: 'text',
    usage: '.xbplogo <text>',

    execute: async (sock, m, { args, reply }) => {

        if (!args.length) {
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • BP LOGO*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🖤💗 Generate BLACKPINK logo:

Example:
.xbplogo Hello World
.xbplogo XADON AI ֎
.xbplogo Blink

> ֎`);
        }

        const text = args.join(' ').trim();

        if (text.length > 20) {
            return reply(`❌ Text too long\n\nMax 20 characters allowed\n\n> ֎`);
        }

        await reply(`⏳ Generating BP logo...\nPlease wait...`);

        try {

            // ✅ Prexzy BLACKPINK Logo API
            const apiUrl = `https://apis.prexzyvilla.site/blackpinklogo?text=${encodeURIComponent(text)}`;

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
    *֎ • XADON AI • BP LOGO*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ *Generated Successfully!*

📝 Text: ${text}
🖤💗 Effect: BLACKPINK Logo

> ֎`,
                mentions: [m.sender]
            }, { quoted: m });

            // ✅ React
            await sock.sendMessage(m.chat, {
                react: { text: "💗", key: m.key }
            });

        } catch (err) {

            console.error('[XBPLOGO ERROR]', err);

            let msg = '❌ BLACKPINK logo failed\n\n';

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