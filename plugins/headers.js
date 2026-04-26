const axios = require('axios');

module.exports = {
    command: 'headers',
    alias: ['head', 'http', 'server'],
    description: 'Check HTTP headers and server info for any URL',
    category: 'xadon',
    usage: '.headers <url>',

    execute: async (sock, m, { args, reply }) => {
        let url = args[0]?.trim();

        if (!url) {
            return reply(`֎ ✪ *XADON AI • HTTP HEADERS* ✪ ֎

🔍 Usage:.headers <url>

Examples:
-.headers google.com
-.headers https://github.com
-.headers api.example.com

💡 Shows server, status, security headers

> ֎`);
        }

        await sock.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

        // Auto-add https if missing
        if (!url.startsWith('http://') &&!url.startsWith('https://')) {
            url = 'https://' + url;
        }

        // Validate URL
        try {
            new URL(url);
        } catch {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`❌ Invalid URL format

Use: example.com or https://example.com

> ֎`);
        }

        try {
            // HEAD request only - doesn't download body
            const res = await axios.head(url, {
                timeout: 8000,
                maxRedirects: 5,
                validateStatus: () => true, // Accept all status codes
                headers: { 'User-Agent': 'XADON-AI-Bot/1.0' }
            });

            const h = res.headers;
            const status = `${res.status} ${res.statusText}`;

            // Important headers to show
            const server = h['server'] || 'N/A';
            const poweredBy = h['x-powered-by'] || 'N/A';
            const contentType = h['content-type'] || 'N/A';
            const contentLength = h['content-length']? `${(h['content-length'] / 1024).toFixed(2)} KB` : 'N/A';
            const location = h['location'] || 'None';

            // Security headers
            const hsts = h['strict-transport-security']? '✅ Enabled' : '❌ Missing';
            const xframe = h['x-frame-options'] || '❌ Missing';
            const xss = h['x-xss-protection'] || '❌ Missing';
            const csp = h['content-security-policy']? '✅ Set' : '❌ Missing';

            const infoText = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • HTTP HEADERS*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🌐 URL: ${url}
📊 Status: ${status}

🖥️ Server Info:
• Server: ${server}
• Powered By: ${poweredBy}
• Type: ${contentType}
• Size: ${contentLength}
• Redirect: ${location}

🔒 Security Headers:
• HSTS: ${hsts}
• X-Frame: ${xframe}
• XSS-Protection: ${xss}
• CSP: ${csp}

💡 Passive header check only

> ֎`;

            await sock.sendMessage(m.chat, {
                text: infoText
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {

            console.error('[HEADERS ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Header check failed\n\n';

            if (err.code === 'ECONNABORTED') {
                msg += '• Request timed out\n• Server may be slow/down';
            } else if (err.code === 'ENOTFOUND') {
                msg += '• Domain not found\n• Check spelling';
            } else if (err.code === 'ECONNREFUSED') {
                msg += '• Connection refused\n• Server blocking requests';
            } else {
                msg += '• Could not reach URL\n• May be offline or blocking bots';
            }

            reply(msg + '\n\n> ֎');
        }
    }
};