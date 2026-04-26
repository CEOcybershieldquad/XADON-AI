const axios = require('axios');

module.exports = {
    command: 'whois',
    alias: ['domain', 'lookup', 'dig'],
    description: 'Get WHOIS info for any domain',
    category: 'xadon',
    usage: '.whois <domain>',

    execute: async (sock, m, { args, reply }) => {
        const domain = args[0]?.toLowerCase().trim();

        if (!domain) {
            return reply(`֎ ✪ *XADON AI • WHOIS LOOKUP* ✪ ֎

🔍 Usage:.whois <domain>

Examples:
-.whois google.com
-.whois crysnovax.link
-.whois github.io

💡 Shows domain registration info

> ֎`);
        }

        await sock.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

        // Basic domain validation
        if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(domain)) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`❌ Invalid domain format

Use: example.com
No http:// or paths

> ֎`);
        }

        try {
            // Using whoisjson API - free, no key needed
            const res = await axios.get(`https://whoisjson.com/api/v1/whois`, {
                params: { domain },
                timeout: 10000,
                headers: { 'User-Agent': 'XADON-AI-Bot/1.0' }
            });

            const data = res.data;

            if (!data || data.error) {
                throw new Error(data?.error || 'Domain not found');
            }

            const registrar = data.registrar || 'N/A';
            const created = data.created_date? new Date(data.created_date).toLocaleDateString('en-US') : 'N/A';
            const updated = data.updated_date? new Date(data.updated_date).toLocaleDateString('en-US') : 'N/A';
            const expires = data.expires_date? new Date(data.expires_date).toLocaleDateString('en-US') : 'N/A';
            const status = data.domain_status?.join(', ') || 'N/A';
            const nameServers = data.name_servers?.slice(0, 3).join('\n') || 'N/A';

            const infoText = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • WHOIS: ${domain.toUpperCase()}*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🏢 Registrar: ${registrar}
📅 Created: ${created}
🔄 Updated: ${updated}
⏰ Expires: ${expires}
📊 Status: ${status}

🌐 Name Servers:
${nameServers}

💡 Public registration data

> ֎`;

            await sock.sendMessage(m.chat, {
                text: infoText
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {

            console.error('[WHOIS ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ WHOIS lookup failed\n\n';

            if (err.response?.status === 404) {
                msg += '• Domain not found or not registered';
            } else if (err.code === 'ECONNABORTED') {
                msg += '• Request timed out. Try again';
            } else if (err.message?.includes('not found')) {
                msg += '• Domain does not exist';
            } else {
                msg += '• API error or invalid domain';
            }

            reply(msg + '\n\n> ֎');
        }
    }
};