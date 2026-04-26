// commands/tools/load-wa-link.js
// 2026 NEON CYBERPUNK WHATSAPP LINK LOADER - Group & Channel Edition 🔥✨
// Hides "https://chat.whatsapp.com/" during loading → reveals full link at end
// Command: !load-wa <whatsapp invite link>

module.exports = {
    command: 'load-wa',
    aliases: ['loadwa', 'waload', 'group-load', 'channel-load', 'loadgroup', 'loadchannel'],
    description: 'Futuristic 2026 quantum loading for WhatsApp group/channel invite links',
    category: 'tools',

    execute: async (sock, m, { args, reply, text }) => {
        try {
            if (!args[0]) {
                return reply(
                    "🌌 *QUANTUM VECTOR REQUIRED*\n" +
                    "No WhatsApp link detected!\n\n" +
                    "Examples:\n" +
                    "• !load-wa https://chat.whatsapp.com/AbCdEfGhIjKlMnOpQrStUv\n" +
                    "• !load-wa https://whatsapp.com/channel/0029Va...\n\n" +
                    "Enter the gate... ⚡"
                );
            }

            let input = args[0].trim();

            // Normalize WhatsApp links (add https if missing)
            let fullUrl = input;
            if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
                fullUrl = 'https://' + fullUrl;
            }

            // Validate it's a WhatsApp invite link
            if (!fullUrl.includes('chat.whatsapp.com') && !fullUrl.includes('whatsapp.com/channel')) {
                return reply("🔴 INVALID VECTOR\nThis appears to be not a WhatsApp group or channel invite link.\nUse a real one like https://chat.whatsapp.com/...");
            }

            // Clean display: remove protocol + common WhatsApp prefix
            let cleanDisplay = fullUrl
                .replace(/^https?:\/\//i, '')
                .replace(/^chat\.whatsapp\.com\//i, '')
                .replace(/^whatsapp\.com\/channel\//i, '');

            if (cleanDisplay === fullUrl.replace(/^https?:\/\//i, '')) {
                cleanDisplay = "UNKNOWN-CHANNEL-CODE"; // fallback
            }

            // Futuristic loading sequence with WhatsApp-themed flair
            const stages = [
                { text: "NEON CORE BOOTING...", delay: 1200 },
                { text: "OPENING WHATSAPP DIMENSIONAL RIFT... ༺✦༻", delay: 1500 },
                { text: "SYNCING GROUP/CHANNEL GATEWAY... ⚛️", delay: 1800 },
                { text: "DECRYPTING INVITE PROTOCOL... 🔮", delay: 2000 },
                { text: "STABILIZING CHAT MATRIX... 99%", delay: 2200 },
                { text: "TRANSMISSION COMPLETE! LINK MATERIALIZED!", delay: 2500 }
            ];

            // Initial message (clean display – no prefix)
            let loadingMsg = await sock.sendMessage(m.chat, {
                text: `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃      XADON WA-LINK HYPERLOADER 2026     ┃
┃     QUANTUM GROUP / CHANNEL TRANSIT     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

Target Vector: ${cleanDisplay}

STATUS: INITIATING WHATSAPP GATEWAY... ⏳

[          ] 0%`,
                mentions: [m.sender]
            }, { quoted: m });

            // Progress animation
            let progress = 0;
            for (let i = 0; i < stages.length; i++) {
                const stage = stages[i];

                progress = Math.min(100, progress + Math.floor(100 / stages.length));
                const bar = '█'.repeat(Math.floor(progress / 10)) + ' '.repeat(10 - Math.floor(progress / 10));

                const updatedText = `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃      XADON WA-LINK HYPERLOADER 2026     ┃
┃     QUANTUM GROUP / CHANNEL TRANSIT     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

Target Vector: ${cleanDisplay}

${stage.text}

[${bar}] ${progress}%`;

                await sock.sendMessage(m.chat, {
                    text: updatedText,
                    edit: loadingMsg.key
                });

                await new Promise(resolve => setTimeout(resolve, stage.delay));
            }

            // Final reveal with FULL link + beautiful menu-style success
            const finalMsg = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃          TRANSMISSION SUCCESS – 2026          ┃
┃     WHATSAPP GATEWAY FULLY MATERIALIZED      ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

🔥 TARGET LINK SECURED & READY TO JOIN 🔥

${fullUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           *XADON AI • WHATSAPP NEXUS*
      NEON CORE ACTIVATED – CHAT DIMENSION OPEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Group/Channel vector fully stabilized, boss.  
Join now and expand your network in the neon era. 🌌⚡`;

            await sock.sendMessage(m.chat, {
                text: finalMsg,
                edit: loadingMsg.key
            });

            // Victory reaction
            await sock.sendMessage(m.chat, {
                react: { text: "✨", key: loadingMsg.key }
            });

        } catch (err) {
            console.error("WA-LINK LOADER CRASH:", err);
            await reply("🔴 GATEWAY COLLAPSE\nLink stabilization failed: " + err.message);
        }
    }
};