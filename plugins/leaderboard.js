const fs = require('fs');

module.exports = {
    command: 'leaderboard',
    alias: ['lb', 'rich', 'top', 'baltop'],
    description: 'Show richest users',
    category: 'economy',
    usage: '.leaderboard',

    execute: async (sock, m, { reply }) => {

        const ECONOMY_PATH = './database/economy.json';

        // ✅ Check if DB exists
        if (!fs.existsSync(ECONOMY_PATH)) {
            return reply(`❌ No economy data yet\n\nStart earning with.daily or.work\n\n> ֎`);
        }

        // ✅ Load DB
        const db = JSON.parse(fs.readFileSync(ECONOMY_PATH, 'utf8'));

        // ✅ Get all users and calculate total
        const users = Object.keys(db).map(id => ({
            id: id,
            total: db[id].wallet + db[id].bank,
            wallet: db[id].wallet,
            bank: db[id].bank
        }));

        // ✅ Filter users with money and sort
        const sorted = users
           .filter(u => u.total > 0)
           .sort((a, b) => b.total - a.total)
           .slice(0, 10); // Top 10

        if (sorted.length === 0) {
            return reply(`❌ No one has money yet\n\nStart earning with.daily or.work\n\n> ֎`);
        }

        // ✅ Build leaderboard text
        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        let text = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • TOP 10*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

`;

        const mentions = [];
        sorted.forEach((user, i) => {
            const rank = medals[i] || `${i + 1}.`;
            const username = user.id.split('@')[0];
            text += `${rank} @${username}\n`;
            text += ` 💰 ${user.total.toLocaleString()} coins\n`;
            mentions.push(user.id);
        });

        // ✅ Find sender rank
        const senderRank = users
           .filter(u => u.total > 0)
           .sort((a, b) => b.total - a.total)
           .findIndex(u => u.id === m.sender) + 1;

        if (senderRank > 0) {
            text += `\n📊 Your Rank: #${senderRank}\n`;
            text += `💵 Your Total: ${(db[m.sender].wallet + db[m.sender].bank).toLocaleString()} coins\n`;
        }

        text += `\n> ֎`;

        await sock.sendMessage(m.chat, {
            text: text,
            mentions: mentions
        }, { quoted: m });

        // ✅ React
        await sock.sendMessage(m.chat, {
            react: { text: "🏆", key: m.key }
        });
    }
};