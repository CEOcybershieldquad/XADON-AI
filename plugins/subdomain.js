const axios = require('axios');

module.exports = {
    command: 'subdomain',
    alias: ['sub', 'subdomains', 'crt'],
    description: 'Find subdomains via Certificate Transparency logs',
    category: 'xadon',
    usage: '.subdomain <domain>',

    execute: async (sock, m, { args, reply }) => {
        let domain = args[0]?.toLowerCase().trim();

        if (!domain) {
            return reply(`֎ ✪ *XADON AI • SUBDOMAIN FINDER* ✪ ֎

🔍 Usage:.subdomain <domain>

Examples:
-.subdomain google.com
-.subdomain github.com
-.subdomain tesla.com

💡 Finds subdomains from SSL cert logs

> ֎`);
        }

        await sock.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

        // Remove protocol and path if present
        domain = domain.replace(/^https?:\/\//, '').split('/')[0];

        // Validate domain
        if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(domain)) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`❌ Invalid domain format

Use: example.com
No http:// or paths

> ֎`);
        }

        try {
            // Using crt.sh Certificate Transparency API
            const res = await axios.get(`https://crt.sh/`, {
                params: {
                    q: `%.${domain}`,
                    output: 'json'
                },
                timeout: 15000,
                headers: { 'User-Agent': 'XADON-AI-Bot/1.0' }
            });

            if (!res.data || res.data.length === 0) {
                throw new Error('No subdomains found');
            }

            // Extract unique subdomains
            const subdomains = new Set();
            res.data.forEach(cert => {
                const names = cert.name_value.split('\n');
                names.forEach(name => {
                    name = name.trim().toLowerCase();
                    // Filter wildcards and root domain
                    if (name.endsWith(`.${domain}`) &&!name.startsWith('*.')) {
                        subdomains.add(name);
                    }
                });
            });

            const subArray = Array.from(subdomains).sort();

            if (subArray.length === 0) {
                throw new Error('No subdomains found');
            }

            // Limit to 30 results to avoid spam
            const displaySubs = subArray.slice(0, 30);
            const moreCount = subArray.length - displaySubs.length;

            let subList = displaySubs.map((sub, i) => `${i + 1}. ${sub}`).join('\n');

            if (moreCount > 0) {
                subList += `\n\n...and ${moreCount} more`;
            }

            const infoText = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • SUBDOMAINS: ${domain.toUpperCase()}*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🔍 Found: ${subArray.length} subdomain(s)

${subList}

💡 Via Certificate Transparency logs
⚠️ Only shows domains with SSL certs

> ֎`;

            await sock.sendMessage(m.chat, {
                text: infoText
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {

            console.error('[SUBDOMAIN ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Subdomain search failed\n\n';

            if (err.message?.includes('No subdomains')) {
                msg += '• No subdomains found in CT logs\n• Domain may not use HTTPS\n• Or has no subdomains';
            } else if (err.code === 'ECONNABORTED') {
                msg += '• Request timed out\n• crt.sh may be slow';
            } else {
                msg += '• API error or domain invalid\n• Try again later';
            }

            reply(msg + '\n\n> ֎');
        }
    }
};