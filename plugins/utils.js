const fetch = require('node-fetch');

module.exports = {
    command: 'xutils',
    alias: ['ai', 'realistic', 'geoip', 'ip', 'obf', 'html2img'],
    description: 'XADON AI • Multi-tool: AI generate, GeoIP, IP, Obfuscate, HTML2IMG',
    category: 'xadon',
    usage: `.xutils <subcommand> [parameters]

Subcommands:
• genimg <prompt> - Generate realistic image
• geoip <ip> - Get geolocation info
• myip - Get your public IP
• obfhigh <code> [encoding] - Obfuscate code
• html2img <html> [width] [height] [format] - Render HTML to image
`,

    execute: async (sock, m, { args, reply }) => {
        if (!args.length) return reply(this.usage);

        const sub = args[0].toLowerCase();

        try {
            // ===== GENIMG =====
            if (['genimg', 'ai', 'realistic', 'imagine'].includes(sub)) {
                if (args.length < 2) return reply('⚠️ Please provide a prompt\nExample: .xutils genimg beautiful cyberpunk city');

                const prompt = args.slice(1).join(' ');
                const negative_prompt = "blurry, low quality, deformed, ugly, bad anatomy, extra limbs";

                await reply('⏳ Generating image... Please wait...');

                const apiUrl = `https://apis.prexzyvilla.site/ai/realistic?prompt=${encodeURIComponent(prompt)}&negative_prompt=${encodeURIComponent(negative_prompt)}`;
                const response = await fetch(apiUrl);

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                let imageBuffer;
                const contentType = response.headers.get('content-type');

                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    const imageUrl = data.url || data.image_url || data.result;
                    if (!imageUrl) throw new Error('No image returned');
                    const imgRes = await fetch(imageUrl);
                    imageBuffer = Buffer.from(await imgRes.arrayBuffer());
                } else {
                    imageBuffer = Buffer.from(await response.arrayBuffer());
                }

                await sock.sendMessage(m.chat, { image: imageBuffer, caption: `✅ *Generated Successfully!*\nPrompt: ${prompt}` }, { quoted: m });
                return await sock.sendMessage(m.chat, { react: { text: "🎨", key: m.key } });
            }

            // ===== GEOIP =====
            if (sub === 'geoip') {
                const ip = args[1];
                if (!ip) return reply('⚠️ Please provide an IP\nExample: .xutils geoip 8.8.8.8');
                const { data } = await fetch(`https://apis.prexzyvilla.site/tools/geoip?ip=${ip}`).then(res => res.json());
                return reply(`🌍 *GeoIP Info for ${ip}:*\n\`\`\`${JSON.stringify(data, null, 2)}\`\`\``);
            }

            // ===== MY IP =====
            if (sub === 'myip') {
                const { data } = await fetch(`https://apis.prexzyvilla.site/tools/myip`).then(res => res.json());
                return reply(`🌐 *Your Public IP Info:*\n\`\`\`${JSON.stringify(data, null, 2)}\`\`\``);
            }

            // ===== OBFUSCATE HIGH =====
            if (sub === 'obfhigh') {
                const code = args[1];
                const encoding = args[2] || 'base64';
                if (!code) return reply('⚠️ Please provide code to obfuscate\nExample: .xutils obfhigh "console.log(123);" base64');
                const { data } = await fetch(`https://apis.prexzyvilla.site/tools/obfhigh?code=${encodeURIComponent(code)}&encoding=${encodeURIComponent(encoding)}`).then(res => res.json());
                return reply(`🛡️ *Obfuscated Code:*\n\`\`\`${data.result || 'No result'}\`\`\``);
            }

            // ===== HTML2IMG =====
            if (sub === 'html2img') {
                const html = args[1];
                const width = args[2] || 800;
                const height = args[3] || 600;
                const format = args[4] || 'png';
                if (!html) return reply('⚠️ Please provide HTML content\nExample: .xutils html2img "<h1>Hello</h1>" 800 600 png');
                const apiUrl = `https://apis.prexzyvilla.site/tools/html2img?html=${encodeURIComponent(html)}&width=${width}&height=${height}&format=${format}`;
                const imgRes = await fetch(apiUrl);
                const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
                return await sock.sendMessage(m.chat, { image: imgBuffer, caption: `✅ HTML2IMG Generated (${width}x${height})` }, { quoted: m });
            }

            // Unknown subcommand
            return reply('❌ Unknown subcommand. Use genimg, geoip, myip, obfhigh, html2img.');

        } catch (err) {
            console.error('[XADONUTILS ERROR]', err);
            return reply(`❌ Operation failed\n• ${err.message}`);
        }
    }
};