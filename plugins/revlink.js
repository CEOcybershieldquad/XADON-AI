module.exports = {
    command: 'revlink',
    aliases: ['reverselink', 'fixlink', 'fullgroup'],
    description: 'Convert short WhatsApp group link to full link with loading animation',
    category: 'tools',

    execute: async (sock, m, { args, text }) => {
        if (!args[0]) {
            return sock.sendMessage(m.chat, { 
                text: "⚡ *Usage:* .revlink /GQRMhtoqEBeCWrPLoqQvYs?mode=git\n" +
                      "or .revlink GQRMhtoqEBeCWrPLoqQvYs" 
            }, { quoted: m });
        }

        let input = args[0].trim();

        // Clean input - remove possible https://chat.whatsapp.com/ if someone already added it
        input = input
            .replace(/^https?:\/\/chat\.whatsapp\.com\//i, '')
            .replace(/^\//, '')           // remove leading /
            .split('?')[0];               // remove query params for clean code

        if (!input || input.length < 15) {
            return sock.sendMessage(m.chat, { 
                text: "❌ Link code looks too short or invalid" 
            }, { quoted: m });
        }

        // Stage 1 - Starting message
        let loadingMsg = await sock.sendMessage(m.chat, {
            text: `🌌 *XADON AI - LINK RECONSTRUCTOR v1.0*\n\n` +
                  `Decoding vector... ${input}\n` +
                  `[          ] 0%`
        }, { quoted: m });

        // Loading animation (edit same message 8 times)
        const stages = [12, 25, 38, 50, 65, 78, 90, 100];
        const messages = [
            "Extracting invite code...",
            "Validating checksum...",
            "Rebuilding protocol...",
            "Establishing secure tunnel...",
            "Decrypting group vector...",
            "Synchronizing metadata...",
            "Finalizing connection...",
            "Transmission complete!"
        ];

        for (let i = 0; i < stages.length; i++) {
            const percent = stages[i];
            const bar = '█'.repeat(Math.floor(percent / 10)) + ' '.repeat(10 - Math.floor(percent / 10));

            await new Promise(r => setTimeout(r, 400 + Math.random() * 300)); // random realistic delay

            await sock.sendMessage(m.chat, {
                text: `🌌 *XADON AI - LINK RECONSTRUCTOR v1.0*\n\n` +
                      `${messages[i]}\n` +
                      `[${bar}] ${percent}%`,
                edit: loadingMsg.key
            });
        }

        // Final success
        const fullLink = `https://chat.whatsapp.com/${input}`;

        const finalText = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
   *RECONSTRUCTION COMPLETE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

Original vector: ${input}

Full secure link:

${fullLink}

> Ready to join • Reality synced ⚡`;

        await sock.sendMessage(m.chat, {
            text: finalText,
            edit: loadingMsg.key
        });

        // Nice reaction
        await sock.sendMessage(m.chat, {
            react: { text: "✨", key: loadingMsg.key }
        });
    }
};