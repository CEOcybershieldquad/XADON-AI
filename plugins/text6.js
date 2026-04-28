module.exports = {
    command: 'xflagtext',
    alias: ['xflag', 'xflagbanner', 'xbannertext'],
    description: 'Create flag banner text effects using XADON AI',
    category: 'text',
    usage: '.xflagtext <text>',

    execute: async (sock, m, { args, reply }) => {

        if (!args.length) {
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • FLAG*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🚩 Generate flag banner text:

Example:
.xflagtext Hello World
.xflagtext XADON AI ֎
.xflagtext Nigeria

> ֎`);
        }

        const text = args.join(' ').trim();

        if (text.length > 30) {
            return reply(`❌ Text too long\n\nMax 30 characters allowed\n\n> ֎`);
        }

        await reply(`⏳ Generating flag banner...\nPlease wait...`);

        try {

            // ✅ Prexzy Flag Text API
            const apiUrl = `https://apis.prexzyvilla.site/flagtext?text=${encodeURIComponent(text)}`;

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
    *֎ • XADON AI • FLAG*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ *Generated Successfully!*

📝 Text: ${text}
🚩 Effect: Flag Banner

> ֎`,
                mentions: [m.sender]
            }, { quoted: m });

            // ✅ React
            await sock.sendMessage(m.chat, {
                react: { text: "🚩", key: m.key }
            });

        } catch (err) {

            console.error('[XFLAGTEXT ERROR]', err);

            let msg = '❌ Flag banner failed\n\n';

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