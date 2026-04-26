import axios from 'axios';

module.exports {
    command: 'flux',
    aliases: ['fluxpro', 'img', 'generate'],
    category: 'ai',
    description: 'Generate image using Flux Pro AI',
    usage: 'flux <prompt>',
    example: 'flux a cute cat in space',
    cooldown: 10,
    permissions: ['user'],
    args: true,
    minArgs: 1,
    maxArgs: Infinity,
    typing: true,
    premium: false,
    hidden: false,
    ownerOnly: false,
    supportsReply: false,
    supportsChat: false,
    supportsReact: true,
    supportsButtons: false,

    async execute(options) {
        const {
            sock,
            message,
            args,
            from,
            sender,
            prefix
        } = options;

        try {
            const prompt = args.join(' ').trim();

            if (!prompt) {
                return await sock.sendMessage(from, {
                    text: `Usage: ${prefix}flux <image prompt>\n\nExample: ${prefix}flux a futuristic city at night`
                }, { quoted: message });
            }

            // React to user's message
            await sock.sendMessage(from, {
                react: { text: '🖼️', key: message.key }
            });

            // Send processing message
            const statusMsg = await sock.sendMessage(from, {
                text: '⏳ Generating image with Flux Pro...'
            }, { quoted: message });

            // API call - assuming returns JSON with 'imageUrl' or direct binary
            const apiUrl = `https://arychauhann.onrender.com/api/fluxpro?prompt=${encodeURIComponent(prompt)}`;
            const { data } = await axios.get(apiUrl, {
                timeout: 60000, // Longer timeout for image gen
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                },
                responseType: 'arraybuffer' // For binary image
            });

            // If JSON with url, fetch url; assume direct image buffer
            let imageBuffer;
            if (typeof data === 'object' && data.imageUrl) {
                // Fetch from url
                const imgRes = await axios.get(data.imageUrl, { responseType: 'arraybuffer' });
                imageBuffer = Buffer.from(imgRes.data);
            } else {
                // Direct buffer
                imageBuffer = Buffer.from(data);
            }

            // Send image
            await sock.sendMessage(from, {
                image: imageBuffer,
                caption: `Generated with Flux Pro: "${prompt}"`,
                mimetype: 'image/png' // Assume PNG
            }, { quoted: message });

            // Edit status to done or remove
            await sock.sendMessage(from, {
                text: '✅ Image generated!',
                edit: statusMsg.key
            }, { quoted: message });

            // Success react
            await sock.sendMessage(from, {
                react: { text: '✅', key: message.key }
            });

        } catch (error) {
            console.error('Flux command error:', error);

            const errorMsg = error.code === 'ECONNABORTED'
                ? 'Generation timeout - Try a simpler prompt'
                : error.response?.status === 429
                ? 'Rate limit exceeded - try again in a moment'
                : error.message || 'Unknown error occurred';

            await sock.sendMessage(from, {
                text: `Failed to generate image\n\nError: ${errorMsg}\nTry again in a moment`
            }, { quoted: message });

            await sock.sendMessage(from, {
                react: { text: '❌', key: message.key }
            });
        }
    }
};