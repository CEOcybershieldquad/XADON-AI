const axios = require('axios');

const VT_API_KEY = '23e62ab81fe1c82d865f39fc674dead42b1ae2b3079fffebf96be5b19aebcf47';

module.exports = {
    command: 'scanurl',
    aliases: ['urlscan', 'checkurl', 'vtscan', 'virustotal'],
    category: 'xadon',
    description: 'Scan URL with VirusTotal • Real-time safety check',

    emoji: {
        wait:     '🔍',
        safe:     '🟢',
        warning:  '🟡',
        danger:   '🔴',
        error:    '❌',
        success:  '✅'
    },

    cooldown: 15, // prevent spam/abuse

    execute: async (sock, m, { args, prefix, command, reply }) => {
        const { emoji } = module.exports;

        if (!args[0]) {
            return reply(
                `${emoji.error} Please provide a URL\n\n` +
                `Examples:\n` +
                `• ${prefix + command} https://example.com\n` +
                `• ${prefix + command} suspicious-site.xyz`
            );
        }

        let url = args[0].trim();
        if (!url.match(/^https?:\/\//i)) {
            url = 'https://' + url;
        }

        try {
            new URL(url);
        } catch {
            return reply(`${emoji.error} Invalid URL format`);
        }

        // ── Initial feedback ───────────────────────────────────────
        await reply(
            `${emoji.wait} Scanning URL with VirusTotal...\n` +
            `This may take 10–20 seconds`
        );

        try {
            const headers = {
                'x-apikey': VT_API_KEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            };

            // ── 1. Submit URL for analysis ────────────────────────────
            const submitForm = new URLSearchParams();
            submitForm.append('url', url);

            const submitRes = await axios.post(
                'https://www.virustotal.com/api/v3/urls',
                submitForm.toString(),
                { headers, timeout: 25000 }
            );

            const analysisId = submitRes.data?.data?.id;
            if (!analysisId) throw new Error('No analysis ID received');

            // Wait a bit – VT needs time to process
            await new Promise(r => setTimeout(r, 10000));

            // ── 2. Get analysis result ────────────────────────────────
            const resultRes = await axios.get(
                `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
                { headers, timeout: 20000 }
            );

            const attrs = resultRes.data?.data?.attributes;
            if (!attrs) throw new Error('No analysis data returned');

            const stats = attrs.stats;
            const scanDate = new Date(attrs.date * 1000).toLocaleString('en-NG', {
                timeZone: 'Africa/Lagos',
                dateStyle: 'medium',
                timeStyle: 'short'
            });

            // Determine overall verdict
            let verdict = 'SAFE';
            let verdictEmoji = emoji.safe;
            let verdictText = 'No malicious detections';

            if (stats.malicious >= 3) {
                verdict = 'DANGEROUS';
                verdictEmoji = emoji.danger;
                verdictText = `${stats.malicious} security vendors flagged this URL as malicious`;
            } else if (stats.malicious >= 1 || stats.suspicious >= 3) {
                verdict = 'RISKY';
                verdictEmoji = emoji.warning;
                verdictText = `Detected by ${stats.malicious} malicious + ${stats.suspicious} suspicious engines`;
            }

            // ── Final beautiful report ────────────────────────────────
            const report = 
                `🛡️ *XADON SECURITY SCAN REPORT*\n` +
                `──────────────────────────────\n` +
                `🔗 *URL:* ${url}\n` +
                `📅 *Scanned:* ${scanDate} WAT\n` +
                `──────────────────────────────\n` +
                `${verdictEmoji} *Verdict:* ${verdict}\n` +
                `──────────────────────────────\n` +
                `Detailed Results:\n` +
                `  ${emoji.safe} Harmless   : ${stats.harmless}\n` +
                `  ${emoji.warning} Suspicious : ${stats.suspicious}\n` +
                `  ${emoji.danger} Malicious  : ${stats.malicious}\n` +
                `  ❓ Undetected : ${stats.undetected}\n` +
                `──────────────────────────────\n` +
                `Powered by VirusTotal • XADON Protocol`;

            await reply(report);

            // Optional: change reaction based on result
            await sock.sendMessage(m.chat, {
                react: {
                    text: verdictEmoji,
                    key: m.key
                }
            });

        } catch (err) {
            console.error('[XADON-VT-SCAN]', err.message || err);

            let errMsg = 'Scan failed – please try again later';
            if (err.response?.status === 429) {
                errMsg = 'Rate limit reached – wait a few minutes';
            } else if (err.response?.status === 401 || err.response?.status === 403) {
                errMsg = 'API key issue – contact bot admin';
            } else if (err.code === 'ECONNABORTED') {
                errMsg = 'Request timed out – VirusTotal is slow right now';
            }

            await reply(
                `${emoji.error} *Scan Error*\n` +
                `→ ${errMsg}\n` +
                `(VirusTotal may be busy)`
            );

            await sock.sendMessage(m.chat, {
                react: { text: emoji.error, key: m.key }
            });
        }
    }
};