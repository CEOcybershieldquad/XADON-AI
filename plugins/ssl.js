const https = require('https');
const tls = require('tls');

function getCertInfo(hostname) {
    return new Promise((resolve, reject) => {
        const options = {
            host: hostname,
            port: 443,
            servername: hostname,
            rejectUnauthorized: false, // Get cert even if invalid
            timeout: 8000
        };

        const socket = tls.connect(options, () => {
            const cert = socket.getPeerCertificate(true);
            socket.end();

            if (!cert || Object.keys(cert).length === 0) {
                return reject(new Error('No certificate found'));
            }
            resolve(cert);
        });

        socket.on('error', reject);
        socket.setTimeout(8000, () => {
            socket.destroy();
            reject(new Error('Connection timeout'));
        });
    });
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function daysUntil(dateStr) {
    if (!dateStr) return 0;
    const diff = new Date(dateStr) - new Date();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

module.exports = {
    command: 'ssl',
    alias: ['cert', 'tls', 'https'],
    description: 'Check SSL certificate info for any domain',
    category: 'xadon',
    usage: '.ssl <domain>',

    execute: async (sock, m, { args, reply }) => {
        let domain = args[0]?.toLowerCase().trim();

        if (!domain) {
            return reply(`֎ ✪ *XADON AI • SSL CHECKER* ✪ ֎

🔒 Usage:.ssl <domain>

Examples:
-.ssl google.com
-.ssl github.com
-.ssl expired.badssl.com

💡 Shows certificate issuer, expiry, validity

> ֎`);
        }

        await sock.sendMessage(m.chat, { react: { text: '🔒', key: m.key } });

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
            const cert = await getCertInfo(domain);

            const subject = cert.subject?.CN || 'N/A';
            const issuer = cert.issuer?.O || cert.issuer?.CN || 'N/A';
            const validFrom = formatDate(cert.valid_from);
            const validTo = formatDate(cert.valid_to);
            const daysLeft = daysUntil(cert.valid_to);
            const altNames = cert.subjectaltname?.replace(/DNS:/g, '').split(', ').slice(0, 3).join(', ') || 'None';
            const fingerprint = cert.fingerprint?.replace(/:/g, '').slice(0, 16) + '...' || 'N/A';

            // Status emoji
            let statusEmoji = '✅';
            let statusText = 'Valid';
            if (daysLeft < 0) {
                statusEmoji = '❌';
                statusText = 'EXPIRED';
            } else if (daysLeft < 30) {
                statusEmoji = '⚠️';
                statusText = 'Expires Soon';
            }

            const infoText = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • SSL CERT: ${domain.toUpperCase()}*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

${statusEmoji} Status: ${statusText}
🔒 Subject: ${subject}
🏢 Issuer: ${issuer}

📅 Valid From: ${validFrom}
⏰ Valid To: ${validTo}
📊 Expires In: ${daysLeft > 0? daysLeft + ' days' : 'EXPIRED'}

🌐 Alt Names: ${altNames}
🔑 Fingerprint: ${fingerprint}

💡 Certificate is ${daysLeft >= 0? 'trusted' : 'invalid'}

> ֎`;

            await sock.sendMessage(m.chat, {
                text: infoText
            }, { quoted: m });

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {

            console.error('[SSL ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ SSL check failed\n\n';

            if (err.message?.includes('timeout')) {
                msg += '• Connection timed out\n• Server may be down';
            } else if (err.message?.includes('ENOTFOUND')) {
                msg += '• Domain not found\n• Check spelling';
            } else if (err.message?.includes('ECONNREFUSED')) {
                msg += '• Port 443 closed\n• No HTTPS on this domain';
            } else if (err.message?.includes('No certificate')) {
                msg += '• No SSL certificate found\n• Site uses HTTP only';
            } else {
                msg += '• Could not fetch certificate\n• Server may block requests';
            }

            reply(msg + '\n\n> ֎');
        }
    }
};