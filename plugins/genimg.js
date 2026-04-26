module.exports = {
    command: 'genimg',
    alias: ['ai', 'realistic', 'imagine'],
    description: 'Generate realistic image using XADON AI',
    category: 'generate',
    usage: '.genimg <your prompt>',

    execute: async (sock, m, { args, reply }) => {

        if (!args.length) {
            return reply(`✨ ✪ *XADON AI • REALISTIC GENERATOR* ✪ ✨

🤖 Generate realistic images:

Example:
.genimg beautiful Nigerian Mosque in Lagos at night
.genimg handsome man in suit, cyberpunk style
.genimg cute cat wearing sunglasses`);
        }

        const prompt = args.join(' ').trim();
        const negative_prompt = "blurry, low quality, deformed, ugly, bad anatomy, extra limbs";

        await reply(`⏳ Generating image...\nPlease wait...`);

        try {

            // ✅ FIXED URL
            const apiUrl = `https://apis.prexzyvilla.site/ai/realistic?prompt=${encodeURIComponent(prompt)}&negative_prompt=${encodeURIComponent(negative_prompt)}`;

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
                caption: `✅ *Generated Successfully!*\n\n📝 Prompt: ${prompt}`,
                mentions: [m.sender]
            }, { quoted: m });

            // ✅ React
            await sock.sendMessage(m.chat, {
                react: { text: "🎨", key: m.key }
            });

        } catch (err) {

            console.error('[GENIMG ERROR]', err);

            let msg = '❌ Generation failed\n\n';

            if (err.message.includes('fetch')) {
                msg += '• Network error';
            } else if (err.message.includes('401')) {
                msg += '• API key required';
            } else if (err.message.includes('429')) {
                msg += '• Rate limited (too many requests)';
            } else {
                msg += `• ${err.message}`;
            }

            reply(msg);
        }
    }
};