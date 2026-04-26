// commands/tools/trackip.js
// .trackip 8.8.8.8
// .trackip google.com

const fetch = require('node-fetch');

module.exports = {
    command: 'trackip',
    aliases: ['iptrack', 'iplookup', 'ipinfo', 'geoip'],
    description: 'Get location & info about an IP address or domain',
    category: 'xadon',

    execute: async (sock, m, { args, text }) => {
        if (!args[0]) {
            return sock.sendMessage(m.chat, {
                text: `Usage examples:\n` +
                      `.trackip 8.8.8.8\n` +
                      `.trackip 104.244.42.1\n` +
                      `.trackip google.com`
            }, { quoted: m });
        }

        let input = args[0].trim();

        try {
            // Stage 1 – starting message
            const loadingMsg = await sock.sendMessage(m.chat, {
                text: `🌐 *XADON AI – IP TRACKER v1.0*\n\n` +
                      `Resolving: ${input}\n` +
                      `[          ] 0%`
            }, { quoted: m });

            // Short realistic delay
            await new Promise(r => setTimeout(r, 400));

            // Fetch IP info from ip-api.com (free, no key, fast)
            const apiUrl = `http://ip-api.com/json/${encodeURIComponent(input)}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as`;
            const res = await fetch(apiUrl);
            const data = await res.json();

            await sock.sendMessage(m.chat, {
                text: `🌐 *XADON AI – IP TRACKER v1.0*\n\n` +
                      `Resolving: ${input}\n` +
                      `[█████     ] 50%`,
                edit: loadingMsg.key
            });

            await new Promise(r => setTimeout(r, 500));

            if (data.status !== 'success') {
                return sock.sendMessage(m.chat, {
                    text: `❌ Failed: ${data.message || 'Invalid IP / domain'}\n` +
                          `Try again with a valid IP or domain.`,
                    edit: loadingMsg.key
                });
            }

            // Build beautiful result
            const result = `✦ ───── ⋆⋅ XADON IP TRACK ⋅⋆ ───── ✦\n\n` +
                           `Input: ${input}\n\n` +
                           `IP Location:\n` +
                           `• Country: \( {data.country} ( \){data.countryCode})\n` +
                           `• Region: ${data.regionName}\n` +
                           `• City: ${data.city || 'N/A'}\n` +
                           `• Zip: ${data.zip || 'N/A'}\n\n` +
                           `Coordinates:\n` +
                           `• Lat: ${data.lat}\n` +
                           `• Lon: ${data.lon}\n` +
                           `• Map: https://www.google.com/maps?q=\( {data.lat}, \){data.lon}\n\n` +
                           `Network:\n` +
                           `• ISP: ${data.isp}\n` +
                           `• Org: ${data.org || 'N/A'}\n` +
                           `• AS: ${data.as || 'N/A'}\n\n` +
                           `Timezone: ${data.timezone}\n\n` +
                           `Queried: ${new Date().toLocaleString('en-NG')}\n` +
                           `Powered by XADON AI • Created by Musteqeem ✨`;

            await sock.sendMessage(m.chat, {
                text: result,
                edit: loadingMsg.key
            });

            await sock.sendMessage(m.chat, {
                react: { text: "🌍", key: loadingMsg.key }
            });

        } catch (err) {
            console.error("IP track error:", err.message);

            await sock.sendMessage(m.chat, {
                text: `⚠️ Error: Could not fetch IP info.\n` +
                      `Try again or check your internet.`,
                edit: loadingMsg?.key
            });
        }
    }
};