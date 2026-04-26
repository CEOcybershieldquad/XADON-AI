// commands/tools/getip.js
// .getip  or  .myip  → shows bot's public IP + server info

const os = require('os');
const fetch = require('node-fetch');

module.exports = {
    command: 'getip',
    aliases: ['myip', 'ip', 'serverip', 'botip'],
    description: 'Show bot server public IP + basic info',
    category: 'owner',

    execute: async (sock, m, { reply }) => {
        try {
            // Get public IP (using a free API - fast & reliable)
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            const publicIp = ipData.ip || 'Unable to fetch';

            // Basic server info
            const hostname = os.hostname();
            const uptimeSeconds = os.uptime();
            const uptimeStr = `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m`;

            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Africa/Lagos' });
            const dateStr = now.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
            }).toUpperCase();

            // Beautiful neon menu
            const menu = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
       *XADON AI  •  SERVER INFO*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

┌──────────────────────────────┐
│  PUBLIC IP     →  ${publicIp}    │
│  HOSTNAME      →  ${hostname}    │
│  UPTIME        →  ${uptimeStr}   │
│                              │
│  TIME          →  ${timeStr} WAT │
│  DATE          →  ${dateStr}     │
│                              │
│  Created by Musteqeem ✨      │
└──────────────────────────────┘

> Secure connection • XADON online ⚡`;

            await sock.sendMessage(m.chat, {
                text: menu
            }, { quoted: m });

            // Optional reaction
            await sock.sendMessage(m.chat, {
                react: { text: "🌐", key: m.key }
            });

        } catch (err) {
            console.error("Get IP error:", err);
            await reply("⚠️ Failed to fetch server IP.\nTry again later.");
        }
    }
};