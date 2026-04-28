module.exports = {
    command: 'xclouds',
    alias: ['xcloudeffect', 'xskytext', 'xcloudtext'],
    description: 'Create cloud effect text using XADON AI',
    category: 'text',
    usage: '.xclouds <text>',

    execute: async (sock, m, { args, reply }) => {

        if (!args.length) {
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • CLOUDS*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

☁️ Generate cloud effect text:

Example:
.xclouds Hello World
.xclouds XADON AI ֎
.xclouds Sky High

> ֎`);
        }

        const text = args.join(' ').trim();

        if (text.length > 30) {
            return reply(`❌ Text too long\n\nMax 30 characters allowed\n\n> ֎`);
        }

        await reply(`⏳ Generating cloud effect...\nPlease wait...`);

        try {

            // ✅ Prexzy Cloud Effect API
            const apiUrl = `https://apis.prexzyvilla.site/effectclouds?text=${encodeURIComponent(text)}`;

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
    *֎ • XADON AI • CLOUDS*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ *Generated Successfully!*

📝 Text: ${text}
☁️ Effect: Cloud Text

> ֎`,
                mentions: [m.sender]
            }, { quoted: m });

            // ✅ React
            await sock.sendMessage(m.chat, {
                react: { text: "☁️", key: m.key }
            });

        } catch (err) {

            console.error('[XCLOUDS ERROR]', err);

            let msg = '❌ Cloud effect failed\n\n';

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