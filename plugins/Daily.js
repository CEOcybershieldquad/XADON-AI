const fs = require('fs');

module.exports = {
    command: 'daily',
    alias: ['claim', 'reward', 'dailyclaim'],
    description: 'Claim your daily coins',
    category: 'economy',
    usage: '.daily',
    cooldown: 5,

    execute: async (sock, m, { reply }) => {

        const ECONOMY_PATH = './database/economy.json';

        // ✅ Create database folder if missing
        if (!fs.existsSync('./database')) {
            fs.mkdirSync('./database');
        }

        // ✅ Load or create economy DB
        let db = {};
        if (fs.existsSync(ECONOMY_PATH)) {
            db = JSON.parse(fs.readFileSync(ECONOMY_PATH, 'utf8'));
        }

        const userId = m.sender;

        // ✅ Create user if new
        if (!db[userId]) {
            db[userId] = {
                wallet: 0,
                bank: 0,
                lastDaily: 0,
                lastWork: 0,
                totalEarned: 0
            };
        }

        const user = db[userId];
        const now = Date.now();
        const cooldown = 24 * 60 * 60 * 1000; // 24 hours

        // ✅ Check cooldown
        if (now - user.lastDaily < cooldown) {
            const timeLeft = cooldown - (now - user.lastDaily);
            const hours = Math.floor(timeLeft / (60 * 60 * 1000));
            const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));

            return reply(`⏰ Daily already claimed!\n\nCome back in: ${hours}h ${minutes}m\n\n> ֎`);
        }

        // ✅ Calculate reward: 500-1500 coins
        const reward = Math.floor(Math.random() * 1001) + 500;

        // ✅ Update user
        user.wallet += reward;
        user.lastDaily = now;
        user.totalEarned += reward;

        // ✅ Save
        fs.writeFileSync(ECONOMY_PATH, JSON.stringify(db, null, 2));

        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • DAILY*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ *Daily Claimed!*

💰 You received: ${reward.toLocaleString()} coins
💵 Wallet: ${user.wallet.toLocaleString()} coins
🏦 Bank: ${user.bank.toLocaleString()} coins

Come back in 24 hours!

> ֎`,
            mentions: [m.sender]
        }, { quoted: m });

        // ✅ React
        await sock.sendMessage(m.chat, {
            react: { text: "🎁", key: m.key }
        });
    }
};