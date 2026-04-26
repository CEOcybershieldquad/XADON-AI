const axios = require('axios');

const RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME'];

module.exports = {
    command: 'dns',
    alias: ['dig', 'nslookup', 'records'],
    description: 'Lookup DNS records for any domain',
    category: 'xadon',
    usage: '.dns <domain> [type]',

    execute: async (sock, m, { args, reply }) => {
        const domain = args[0]?.toLowerCase().trim();
        const type = args[1]?.toUpperCase() || 'A';

        if (!domain) {
            return reply(`֎ ✪ *XADON AI • DNS LOOKUP* ✪ ֎

🔍 Usage:.dns <domain> [type]

Record types: A, AAAA, MX, TXT, NS, CNAME

Examples:
-.dns google.com
-.dns github.com MX
-.dns cloudflare.com TXT
-.dns example.com NS

💡 Shows public DNS records

> ֎`);
        }

        await sock.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

        // Validate domain
        if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(domain)) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`❌ Invalid domain format

Use: example.com
No http:// or paths

> ֎`);
        }

        // Validate record type
        if (!RECORD_TYPES.includes(type)) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`❌ Invalid record type

Supported: ${RECORD_TYPES.join(', ')}

Example:.dns ${domain} MX

> ֎`);
        }

        try {
            // Using Google DNS-over-HTTPS API - free, no key
            const res = await axios.get(`https://dns.google/resolve`, {
                params: { name: domain, type: type },
                timeout: 8000,
                headers: { 'User-Agent': 'XADON-AI-Bot/1.0' }
            });

            const data = res.data;

            if (data.Status!== 0 ||!data.Answer) {
                throw new Error(`No ${type} records found`);
            }

            let records = data.Answer.map(r => {
                let val = r.data;
                // Clean up TXT records
                if (type === 'TXT') val = val.replace(/^"|"$/g, '');
                // Format MX records
                if (type === 'MX') {
                    const [priority, host] = val.split(' ');
                    val = `${host} (Priority: ${priority})`;
                }
                return `• ${val}`;
            }).join('\n');

            // Limit output
            if (records.length > 1500) {
                records = records.slice(0, 1500) + '\n...truncated';
            }

            const infoText = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • DNS: ${domain.toUpperCase()}*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📊 Record Type: ${type}
🔢 Found: ${data.Answer.length} record(s)

${records}

💡 Via Google DNS

> ֎`;

            await sock.sendMessage(m.chat, {
                text: infoText
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {

            console.error('[DNS ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = `❌ DNS lookup failed\n\n`;

            if (err.message?.includes('No') && err.message?.includes('records')) {
                msg += `• No ${type} records found for ${domain}\n• Try:.dns ${domain} A`;
            } else if (err.code === 'ECONNABORTED') {
                msg += '• Request timed out. Try again';
            } else {
                msg += '• Domain may not exist or API error';
            }

            reply(msg + '\n\n> ֎');
        }
    }
};