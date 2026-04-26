module.exports = {
    command: 'botdetect',
    aliases: ['smartbots', 'detectbot'],
    description: 'Ultra smart bot detection system',
    category: 'group',
    usage: '.botdetect',

    execute: async (sock, m, { reply }) => {

        if (!m.isGroup)
            return reply('❌ Group only command\n> XADON AI');

        const metadata = await sock.groupMetadata(m.chat);
        const participants = metadata.participants;

        let suspects = [];

        participants.forEach(p => {

            const id = p.id;
            const num = id.split('@')[0];
            const activity = global.xadon.activity[id] || {};

            let score = 0;

            // 🧠 Name pattern detection
            if (num.includes('bot') || num.includes('ai') || num.includes('md')) score += 2;

            // ⚡ Command spam detection
            if ((activity.commands || 0) > 10) score += 2;

            // 🤖 Auto-reply speed detection
            if ((activity.messages || 0) > 20 && (activity.commands || 0) > 5) score += 2;

            // ⏱️ Fast activity burst (bot-like)
            if (Date.now() - (activity.lastMsg || 0) < 2000) score += 1;

            // 🎯 Final decision
            if (score >= 3) {
                suspects.push({
                    id,
                    score
                });
            }
        });

        if (!suspects.length) {
            return reply(`✨ ✪ *XADON AI • BOT SCAN* ✪ ✨

✅ No suspicious bots detected

🛡️ Group is clean

> XADON AI`);
        }

        let text = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
   *XADON AI • ULTRA BOT DETECT*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🤖 Suspected Bots: ${suspects.length}

`;

        suspects.forEach((u, i) => {
            const num = u.id.split('@')[0];

            let level = "LOW";
            if (u.score >= 5) level = "HIGH ⚠️";
            else if (u.score >= 3) level = "MEDIUM";

            text += `${i + 1}. @${num}
   Risk: ${level} (${u.score})\n\n`;
        });

        text += `⚠️ Review before taking action

> XADON AI`;

        await sock.sendMessage(m.chat, {
            text,
            mentions: suspects.map(u => u.id)
        }, { quoted: m });

        await sock.sendMessage(m.chat, {
            react: { text: "🤖", key: m.key }
        });
    }
};