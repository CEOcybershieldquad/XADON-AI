const fs = require('fs');

module.exports = {
    command: 'rob',
    alias: ['steal', 'heist'],
    description: 'Rob coins from other users - for fun ooh 😀😀',
    category: 'economy',
    usage: '.rob @user',
    cooldown: 10,

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

        const robberId = m.sender;

        // ✅ Create robber if new
        if (!db[robberId]) {
            db[robberId] = {
                wallet: 0,
                bank: 0,
                lastDaily: 0,
                lastWork: 0,
                lastRob: 0,
                totalEarned: 0
            };
        }

        const robber = db[robberId];

        // ✅ Check rob cooldown: 30 minutes
        const now = Date.now();
        const robCooldown = 30 * 60 * 1000;
        if (now - (robber.lastRob || 0) < robCooldown) {
            const timeLeft = robCooldown - (now - robber.lastRob);
            const minutes = Math.floor(timeLeft / (60 * 1000));
            const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
            return reply(`🚔 Police are watching you!\n\nCooldown: ${minutes}m ${seconds}s\n\n*It's for fun ooh* 😀😀\n\n> ֎`);
        }

        // ✅ Get target
        if (!m.mentionedJid ||!m.mentionedJid[0]) {
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • ROB*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🦹 Rob coins from users

Usage:
.rob @user

Note: You can only rob wallet coins
Bank coins are safe

*It's for fun ooh* 😀😀

> ֎`);
        }

        const targetId = m.mentionedJid[0];

        if (targetId === robberId) {
            return reply(`❌ You can't rob yourself\n\n*It's for fun ooh* 😀😀\n\n> ֎`);
        }

        if (targetId === sock.user.id) {
            return reply(`❌ You can't rob the bot\n\n*It's for fun ooh* 😀😀\n\n> ֎`);
        }

        // ✅ Create target if new
        if (!db[targetId]) {
            db[targetId] = {
                wallet: 0,
                bank: 0,
                lastDaily: 0,
                lastWork: 0,
                lastRob: 0,
                totalEarned: 0
            };
        }

        const target = db[targetId];

        if (target.wallet < 100) {
            return reply(`❌ Target is too broke\n\nMinimum 100 coins in wallet to rob\n\n*It's for fun ooh* 😀😀\n\n> ֎`);
        }

        if (robber.wallet < 50) {
            return reply(`❌ You need at least 50 coins to rob\n\n*It's for fun ooh* 😀😀\n\n> ֎`);
        }

        // ✅ 40% success chance
        const success = Math.random() < 0.40;
        robber.lastRob = now;

        if (success) {
            // Success: steal 20-50% of target wallet
            const stealPercent = Math.random() * 0.3 + 0.2; // 0.2 to 0.5
            const stolen = Math.floor(target.wallet * stealPercent);

            target.wallet -= stolen;
            robber.wallet += stolen;
            robber.totalEarned += stolen;

            fs.writeFileSync(ECONOMY_PATH, JSON.stringify(db, null, 2));

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • HEIST*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🦹 *ROB SUCCESSFUL!* 💰

👤 You robbed: @${targetId.split('@')[0]}
💸 Stolen: ${stolen.toLocaleString()} coins
💵 Your Wallet: ${robber.wallet.toLocaleString()} coins

😀😀 *It's for fun ooh*

> ֎`,
                mentions: [robberId, targetId]
            }, { quoted: m });

            await sock.sendMessage(m.chat, {
                react: { text: "🦹", key: m.key }
            });

        } else {
            // Failed: lose 50-200 coins fine
            const fine = Math.floor(Math.random() * 151) + 50;
            robber.wallet = Math.max(0, robber.wallet - fine);

            fs.writeFileSync(ECONOMY_PATH, JSON.stringify(db, null, 2));

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • HEIST*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🚔 *ROB FAILED!*

👤 Target: @${targetId.split('@')[0]}
👮 You got caught by police!
💸 Fine: -${fine.toLocaleString()} coins

💵 Your Wallet: ${robber.wallet.toLocaleString()} coins

😀😀 *It's for fun ooh*

> ֎`,
                mentions: [robberId, targetId]
            }, { quoted: m });

            await sock.sendMessage(m.chat, {
                react: { text: "🚔", key: m.key }
            });
        }
    }
};