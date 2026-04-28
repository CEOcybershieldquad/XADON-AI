const fs = require('fs');

module.exports = {
    command: 'profile',
    alias: ['prof', 'stats', 'me'],
    description: 'Show your economy profile and stats',
    category: 'economy',
    usage: '.profile [@user]',

    execute: async (sock, m, { args, reply }) => {

        const ECONOMY_PATH = './database/economy.json';
        const INVENTORY_PATH = './database/inventory.json';
        const FARM_PATH = './database/farm.json';

        // ✅ Create database folder if missing
        if (!fs.existsSync('./database')) {
            fs.mkdirSync('./database');
        }

        // ✅ Load databases
        let economy = {};
        let inventory = {};
        let farm = {};

        if (fs.existsSync(ECONOMY_PATH)) {
            economy = JSON.parse(fs.readFileSync(ECONOMY_PATH, 'utf8'));
        }
        if (fs.existsSync(INVENTORY_PATH)) {
            inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
        }
        if (fs.existsSync(FARM_PATH)) {
            farm = JSON.parse(fs.readFileSync(FARM_PATH, 'utf8'));
        }

        // ✅ Get target user
        let targetId = m.sender;
        if (args[0]) {
            targetId = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        }

        // ✅ Check if user exists
        if (!economy[targetId]) {
            return reply(`❌ User not found in economy\n\nThey need to use a command first\n\n> ֎`);
        }

        const user = economy[targetId];
        const userInv = inventory[targetId] || {};
        const userFarm = farm[targetId] || { crops: {}, plots: 3 };

        // ✅ Calculate net worth and rank
        const netWorth = (user.wallet || 0) + (user.bank || 0);

        const sortedUsers = Object.keys(economy)
           .map(id => ({
                id: id,
                total: (economy[id].wallet || 0) + (economy[id].bank || 0)
            }))
           .sort((a, b) => b.total - a.total);

        const rank = sortedUsers.findIndex(u => u.id === targetId) + 1;
        const totalUsers = sortedUsers.length;

        // ✅ Count inventory items
        const itemCount = Object.values(userInv).reduce((a, b) => a + b, 0);
        const cropCount = Object.keys(userFarm.crops).length;

        // ✅ Format last active times
        const now = Date.now();
        const formatTime = (timestamp) => {
            if (!timestamp) return 'Never';
            const diff = now - timestamp;
            if (diff < 60000) return 'Just now';
            if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
            if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
            return `${Math.floor(diff / 86400000)}d ago`;
        };

        const isOwner = targetId === m.sender;
        const mention = isOwner? 'Your' : `@${targetId.split('@')[0]}'s`;

        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • PROFILE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

👤 *${mention} Profile*

💰 *Economy*
 💵 Wallet: ${user.wallet.toLocaleString()} coins
 🏦 Bank: ${user.bank.toLocaleString()} coins
 💎 Net Worth: ${netWorth.toLocaleString()} coins
 📈 Total Earned: ${(user.totalEarned || 0).toLocaleString()} coins
 🏆 Rank: #${rank}/${totalUsers}

🎒 *Inventory*
 📦 Items: ${itemCount}
 🌱 Farm Plots: ${cropCount}/${userFarm.plots}

⏰ *Activity*
 🎁 Daily: ${formatTime(user.lastDaily)}
 💼 Work: ${formatTime(user.lastWork)}
 🎣 Fish: ${formatTime(user.lastFish)}
 ⛏️ Mine: ${formatTime(user.lastMine)}
 🏹 Hunt: ${formatTime(user.lastHunt)}
 🧠 Brainstorm: ${formatTime(user.lastBrainstorm)}

> ֎`,
            mentions: [targetId]
        }, { quoted: m });

        // ✅ React
        await sock.sendMessage(m.chat, {
            react: { text: "📊", key: m.key }
        });
    }
};