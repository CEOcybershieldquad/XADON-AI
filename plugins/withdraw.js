const fs = require('fs');

module.exports = {
    command: 'withdraw',
    alias: ['wd', 'with', 'take'],
    description: 'Withdraw coins from your bank',
    category: 'economy',
    usage: '.withdraw <amount | all>',

    execute: async (sock, m, { args, reply }) => {

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

        if (!args[0]) {
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • BANK*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🏦 Withdraw coins from your bank

Usage:
.withdraw <amount>
.withdraw all

Example:
.withdraw 500
.withdraw all

💵 Wallet: ${user.wallet.toLocaleString()} coins
🏦 Bank: ${user.bank.toLocaleString()} coins

> ֎`);
        }

        // ✅ Parse amount
        let amount;
        if (args[0].toLowerCase() === 'all') {
            amount = user.bank;
        } else {
            amount = parseInt(args[0].replace(/,/g, ''));
        }

        if (isNaN(amount) || amount < 1) {
            return reply(`❌ Enter a valid amount\n\nExample:.withdraw 1000\n\n> ֎`);
        }

        if (user.bank < amount) {
            return reply(`❌ Not enough coins in bank\n\n🏦 Bank: ${user.bank.toLocaleString()} coins\n\n> ֎`);
        }

        // ✅ Transfer coins
        user.bank -= amount;
        user.wallet += amount;

        // ✅ Save
        fs.writeFileSync(ECONOMY_PATH, JSON.stringify(db, null, 2));

        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • WITHDRAW*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ *Withdrawn Successfully!*

💰 Amount: ${amount.toLocaleString()} coins
💵 Wallet: ${user.wallet.toLocaleString()} coins
🏦 Bank: ${user.bank.toLocaleString()} coins

Spend wisely!

> ֎`,
            mentions: [m.sender]
        }, { quoted: m });

        // ✅ React
        await sock.sendMessage(m.chat, {
            react: { text: "💸", key: m.key }
        });
    }
};