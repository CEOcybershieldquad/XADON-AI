// commands/media/carbon.js
// .carbon   → reply to code/text to make carbon.now.sh style image

const fetch = require('node-fetch');

module.exports = {
    command: 'carbon',
    aliases: ['codeimg', 'carboncode'],
    description: 'Convert code/text to beautiful carbon image',
    category: 'media',

    execute: async (sock, m, { reply }) => {
        if (!m.quoted) return reply("Reply to code/text message with .carbon");

        const text = m.quoted.body || m.quoted.conversation || m.quoted.caption || "";
        if (!text.trim()) return reply("No text found in replied message.");

        try {
            await reply("Generating carbon image... ⏳");

            const res = await fetch("https://carbonara.solopov.dev/api/cook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: text,
                    backgroundColor: "#1F816D",
                    theme: "dracula",
                    language: "auto",
                    fontFamily: "JetBrains Mono",
                    fontSize: "lg",
                    lineHeight: "140%",
                    windowTheme: "sharp",
                    exportSize: "2x"
                })
            });

            const buffer = await res.arrayBuffer();

            await sock.sendMessage(m.chat, {
                image: Buffer.from(buffer),
                caption: "✨ Code → Carbon by XADON AI\nCreated by Musteqeem"
            }, { quoted: m });

        } catch (err) {
            reply("⚠️ Failed to generate carbon image.");
            console.error(err);
        }
    }
};