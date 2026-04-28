module.exports = {
    command: 'xgradcolor',
    alias: ['xcolorgrad', 'xfade', 'xrainbowtext'],
    description: 'Create gradient color text effects using XADON AI',
    category: 'text',
    usage: '.xgradcolor <text>',

    execute: async (sock, m, { args, reply }) => {

        if (!args.length) {
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • GRADCOLOR*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🌈 Generate gradient color text:

Example:
.xgradcolor Hello World
.xgradcolor XADON AI ֎
.xgradcolor Rainbow

> ֎`);
        }

        const text = args.join(' ').trim();

        if (text.length > 40) {
            return reply(`❌ Text too long\n\nMax 40 characters allowed\n\n> ֎`);
        }

        await reply(`⏳ Generating gradient colors...\nPlease wait...`);

        try {

            // ✅ Prexzy Gradient Text API
            const apiUrl = `https://apis.prexzyvilla.site/gradienttext?text=${encodeURIComponent(text)}`;

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
    *֎ • XADON AI • GRADCOLOR*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ *Generated Successfully!*

📝 Text: ${text}
🌈 Effect: Gradient Colors

> ֎`,
                mentions: [m.sender]
            }, { quoted: m });

            // ✅ React
            await sock.sendMessage(m.chat, {
                react: { text: "🌈", key: m.key }
            });

        } catch (err) {

            console.error('[XGRADCOLOR ERROR]', err);

            let msg = '❌ Gradient colors failed\n\n';

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