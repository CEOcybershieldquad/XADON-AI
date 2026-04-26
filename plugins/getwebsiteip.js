// commands/tools/getwip.js
// .getwip example.com   or   .getwip https://example.com

const dns = require('dns').promises;

module.exports = {
    command: 'getwip',
    aliases: ['wip', 'webip', 'domainip', 'siteip'],
    description: 'Get IP address(es) of a website/domain',
    category: 'xadon',

    execute: async (sock, m, { args, text }) => {
        if (!args[0]) {
            return sock.sendMessage(m.chat, {
                text: `Usage:\n.getwip example.com\n.getwip https://google.com`
            }, { quoted: m });
        }

        let domain = args[0].trim();

        // Clean input (remove protocol, www, path, etc.)
        domain = domain
            .replace(/^https?:\/\//i, '')
            .replace(/^www\./i, '')
            .split('/')[0]
            .split('?')[0]
            .split('#')[0];

        if (!domain || domain.length < 3) {
            return sock.sendMessage(m.chat, {
                text: "⚠️ Please enter a valid domain (example.com)"
            }, { quoted: m });
        }

        try {
            // Stage 1 - Starting message
            const startMsg = await sock.sendMessage(m.chat, {
                text: `🌐 *XADON AI - DOMAIN IP RESOLVER*\n\nResolving: ${domain}\n[          ] 0%`
            }, { quoted: m });

            // Short fake loading feel
            await new Promise(r => setTimeout(r, 400));

            // Actually resolve DNS (A records = IPv4)
            const addresses = await dns.resolve4(domain, { ttl: true });

            // Stage 2 - 50%
            await sock.sendMessage(m.chat, {
                text: `🌐 *XADON AI - DOMAIN IP RESOLVER*\n\nResolving: ${domain}\n[█████     ] 50%`,
                edit: startMsg.key
            });

            await new Promise(r => setTimeout(r, 500));

            if (addresses.length === 0) {
                return sock.sendMessage(m.chat, {
                    text: `❌ No IPv4 addresses found for ${domain}`,
                    edit: startMsg.key
                });
            }

            // Final result
            let result = `✦ ───── ⋆⋅ XADON IP LOOKUP ⋅⋆ ───── ✦\n\n`;
            result += `Domain: ${domain}\n\n`;

            addresses.forEach((addr, i) => {
                result += `IP ${i+1}:  ${addr.address}\n`;
                if (addr.ttl) result += `   TTL: ${addr.ttl}s\n`;
                result += "\n";
            });

            result += `Queried: ${new Date().toLocaleString('en-NG')}\n`;
            result += `Powered by XADON AI v1.0.0 • Created by Musteqeem ✨`;

            await sock.sendMessage(m.chat, {
                text: result,
                edit: startMsg.key
            });

            await sock.sendMessage(m.chat, {
                react: { text: "🌐", key: startMsg.key }
            });

        } catch (err) {
            console.error("DNS lookup error:", err.message);

            let errMsg = "❌ Failed to resolve domain.";

            if (err.code === 'ENOTFOUND') {
                errMsg = `❌ Domain "${domain}" not found (NXDOMAIN)`;
            } else if (err.code === 'ETIMEOUT') {
                errMsg = "❌ DNS lookup timeout – try again later";
            }

            await sock.sendMessage(m.chat, {
                text: errMsg,
                edit: startMsg?.key || undefined
            });
        }
    }
};