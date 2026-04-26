const config = require("../settings/config");
const os = require("os");

function runtime(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
}

module.exports = {
    command: 'xdn_are_you_here',
    description: 'Check if bot is running',
    category: 'general',
    execute: async (sock, m, {
        args,
        text,
        q,
        quoted,
        mime,
        qmsg,
        isMedia,
        groupMetadata,
        groupName,
        participants,
        groupOwner,
        groupAdmins,
        isBotAdmins,
        isAdmins,
        isGroupOwner,
        isCreator,
        prefix,
        reply,
        config: cmdConfig,
        sender
    }) => {
        try {
            // Royal crown reaction
            await sock.sendMessage(m.chat, { 
                react: { text: "👑", key: m.key } 
            });

            const userName = m.pushName || "Noble User";
            const botUptime = runtime(process.uptime());
            const totalMemory = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
            const usedMemory = (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2);
            const host = os.platform();
            const ping = Date.now() - m.messageTimestamp * 1000;

            const aliveMessage = 
`✨ *${config.settings.title} is Watching Over You* ✨

╔═══════════════════
║  🏰 *𝐗𝐀𝐃𝐎𝐍 ROYAL STATUS*
╠═══════════════════
║ ♕ *User:* ${userName}
║ ⏳ *Uptime:* ${botUptime}
║ 💾 *Memory:* ${usedMemory}MB / ${totalMemory}GB
║ ⚡ *Speed:* ${ping}ms
║ 🖥️ *Platform:* ${host}
║ 📜 *Creator:* ${config.owner}
╚═══════════════════

*"𝐀 𝐊𝐢𝐧𝐠 𝐧𝐞𝐯𝐞𝐫 𝐬𝐥𝐞𝐞𝐩𝐬 𝐧𝐞𝐢𝐭𝐡𝐞𝐫 𝐝𝐨 𝐈"*

👑 Serving the kingdom since deployment
📜 Developed by: ${config.settings.author}

🎭 *Join the Royal Court:*
https://whatsapp.com/channel/0029Vb7ACifD38Cb7Jlj5w3B`;

            await sock.sendMessage(m.chat, {
                image: { url: config.thumbUrl },
                caption: aliveMessage,
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        title: `👑 ${config.settings.title} - Royal Bot`,
                        body: config.settings.description,
                        thumbnailUrl: config.thumbUrl,
                        sourceUrl: "https://whatsapp.com/channel/0029Vb7ACifD38Cb7Jlj5w3B",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: m });

            // Success reaction
            await sock.sendMessage(m.chat, { 
                react: { text: "✨", key: m.key } 
            });

        } catch (error) {
            console.error("Error in alive command:", error);
            await sock.sendMessage(m.chat, { 
                react: { text: "💔", key: m.key } 
            });
            await reply("❌ The royal scroll couldn't be delivered. Please try again.");
        }
    }
};