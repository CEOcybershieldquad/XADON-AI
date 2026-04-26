const axios = require('axios');

module.exports = {
    command: 'ss',
    alias: ['ssp','sstab','ssfull','ssmobile','ssweb'],
    category: 'tools',
    desc: 'Advanced website screenshot tool',

    execute: async (sock, m, { args, reply }) => {

        try {

            const sub = args[0]?.toLowerCase();

            let link = args.slice(1).join(' ') || args[0] || (m.quoted && m.quoted.text);

            // 📌 If subcommand used, adjust link
            if (['mobile','tab','full','web','desktop','info','permission'].includes(sub)) {
                link = args.slice(1).join(' ') || (m.quoted && m.quoted.text);
            }

            if (!link)
                return reply(`✨ ✪ *XADON AI • SCREENSHOT* ✪ ✨

📸 Commands:

• .ss <link>
• .ss mobile <link>
• .ss tab <link>
• .ss full <link>
• .ss web <link>

🧠 Advanced:
• .ss info <link>
• .ss permission <link>

📩 Or reply to a link

> XADON AI`);

            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const found = link.match(urlRegex);
            const targetUrl = found ? found[0] : null;

            if (!targetUrl)
                return reply('❌ Invalid URL\n> XADON AI');

            await sock.sendMessage(m.chat, {
                react: { text: "📸", key: m.key }
            });

            let device = "desktop";

            if (sub === "mobile") device = "phone";
            if (sub === "tab") device = "tablet";
            if (sub === "full") device = "full";
            if (sub === "web") device = "desktop";

            // 📸 SCREENSHOT API
            const api = `https://api-rebix.zone.id/api/ssweb?url=${encodeURIComponent(targetUrl)}&device=${device}`;

            // 🧠 INFO MODE
            if (sub === "info") {

                const html = await axios.get(targetUrl);
                const title = html.data.match(/<title>(.*?)<\/title>/i)?.[1] || "Unknown";

                const res = await axios.get(api, { responseType: 'arraybuffer' });

                return sock.sendMessage(m.chat, {
                    image: Buffer.from(res.data),
                    caption: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
   *XADON AI • SITE INFO*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🌐 URL: ${targetUrl}
📄 Title: ${title}

⚡ Status: Active

> XADON AI`
                }, { quoted: m });
            }

            // 🔐 PERMISSION DETECTOR
            if (sub === "permission") {

                const html = await axios.get(targetUrl);
                const data = html.data.toLowerCase();

                let perms = [];

                if (data.includes('getusermedia')) perms.push('🎤 Microphone');
                if (data.includes('camera')) perms.push('📷 Camera');
                if (data.includes('geolocation')) perms.push('📍 Location');
                if (data.includes('notification')) perms.push('🔔 Notifications');

                if (!perms.length) perms.push('No major permissions detected');

                return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
   *XADON AI • PERMISSIONS*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🌐 ${targetUrl}

🔐 Permissions:
${perms.map(p => "• " + p).join('\n')}

> XADON AI`);
            }

            // 📸 NORMAL SCREENSHOT
            const res = await axios.get(api, { responseType: 'arraybuffer' });

            await sock.sendMessage(
                m.chat,
                {
                    image: Buffer.from(res.data),
                    caption: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
   *XADON AI • SCREENSHOT*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🌐 ${targetUrl}
📱 Mode: ${device}

> XADON AI`
                },
                { quoted: m }
            );

        } catch (err) {

            console.log(err.message);

            reply(`❌ Failed to capture screenshot

• ${err.message}

> XADON AI`);
        }
    }
};