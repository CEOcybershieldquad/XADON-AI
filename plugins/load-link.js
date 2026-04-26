// commands/tools/load-link.js
// 2026 NEON CYBERPUNK LOADING LINK SIMULATOR - Futuristic Style 🔥✨
// Now hides protocol during loading, shows full secure link at the end

module.exports = {
    command: 'load-link',
    aliases: ['load', 'loading', 'cyberload', 'neonload'],
    description: 'Simulate futuristic 2026 quantum loading of any link with neon progress',
    category: 'tools',

    execute: async (sock, m, { args, reply, text }) => {
        try {
            if (!args[0]) {
                return reply(
                    "🌌 *CYBER PROTOCOL ERROR*\n" +
                    "No quantum vector detected!\n\n" +
                    "Usage: !load-link https://example.com\n" +
                    "or !load musteqeem.tech\n" +
                    "Prepare for NEON HYPERSPACE transit... ⚡"
                );
            }

            let input = args[0].trim();
            let fullUrl = input;

            // Normalize to full URL (add https if missing protocol)
            if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
                fullUrl = 'https://' + fullUrl;
            }

            // Clean display version (no protocol) for loading phase
            let cleanDisplay = fullUrl
                .replace(/^https?:\/\//i, '')     // remove http:// or https://
                .replace(/\/$/, '');              // remove trailing slash if present

            // Futuristic loading sequence
            const stages = [
                { text: "INITIALIZING NEON CORE...", delay: 1200 },
                { text: "QUANTUM TUNNEL OPENING... ༺✦༻", delay: 1500 },
                { text: "SYNCHRONIZING HYPERSPACE VECTOR... ⚛️", delay: 1800 },
                { text: "DECRYPTING DIMENSIONAL GATEWAY... 🔮", delay: 2000 },
                { text: "NEURAL PATHWAY STABILIZING... 99%", delay: 2200 },
                { text: "TRANSMISSION COMPLETE! VECTOR MATERIALIZED!", delay: 2500 }
            ];

            // Send initial message with CLEAN display (no http/https)
            let loadingMsg = await sock.sendMessage(m.chat, {
                text: `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     XADON HYPERLOADER 2026     ┃
┃     QUANTUM VECTOR TRANSIT     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

Target Vector: ${cleanDisplay}

STATUS: INITIATING... ⏳

[          ] 0%`,
                mentions: [m.sender]
            }, { quoted: m });

            // Simulate progress bar animation (edit message multiple times)
            let progress = 0;
            for (let i = 0; i < stages.length; i++) {
                const stage = stages[i];

                progress = Math.min(100, progress + Math.floor(100 / stages.length));
                const bar = '█'.repeat(Math.floor(progress / 10)) + ' '.repeat(10 - Math.floor(progress / 10));

                const updatedText = `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     XADON HYPERLOADER 2026     ┃
┃     QUANTUM VECTOR TRANSIT     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

Target Vector: ${cleanDisplay}

${stage.text}

[${bar}] ${progress}%`;

                await sock.sendMessage(m.chat, {
                    text: updatedText,
                    edit: loadingMsg.key
                });

                await new Promise(resolve => setTimeout(resolve, stage.delay));
            }

            // Final success message - NOW showing the FULL correct link with protocol
            const finalMsg = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃       TRANSMISSION SUCCESS        ┃
┃     HYPERSPACE GATEWAY FULLY OPEN  ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

🔥 TARGET VECTOR FULLY MATERIALIZED 🔥

${fullUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          **XADON AI 2026**
    NEON CORE ACTIVATED – REALITY BENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quantum transit complete, boss.  
Secure protocol engaged. 🌌⚡`;

            await sock.sendMessage(m.chat, {
                text: finalMsg,
                edit: loadingMsg.key
            });

            // Victory reaction
            await sock.sendMessage(m.chat, {
                react: { text: "⚡", key: loadingMsg.key }
            });

        } catch (err) {
            console.error("HYPERLOADER CRASH:", err);
            await reply("🔴 QUANTUM COLLAPSE\nVector failed to stabilize: " + err.message);
        }
    }
};