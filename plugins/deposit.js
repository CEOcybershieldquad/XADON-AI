const fs = require('fs');

module.exports = {
    command: 'deposit',
    alias: ['dep', 'tobank', 'save'],
    description: 'Deposit coins to your bank',
    category: 'economy',
    usage: '.deposit <amount | all>',

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

🏦 Deposit coins to your bank

Usage:
.deposit <amount>
.deposit all

Example:
.deposit 500
.deposit all

💵 Wallet: ${user.wallet.toLocaleString()} coins
🏦 Bank: ${user.bank.toLocaleString()} coins

> ֎`);
        }

        // ✅ Parse amount
        let amount;
        if (args[0].toLowerCase() === 'all') {
            amount = user.wallet;
        } else {
            amount = parseInt(args[0].replace(/,/g, ''));
        }

        if (isNaN(amount) || amount < 1) {
            return reply(`❌ Enter a valid amount\n\nExample:.deposit 1000\n\n> ֎`);
        }

        if (user.wallet < amount) {
            return reply(`❌ Not enough coins in wallet\n\n💵 Wallet: ${user.wallet.toLocaleString()} coins\n\n> ֎`);
        }

        // ✅ Transfer coins
        user.wallet -= amount;
        user.bank += amount;

        // ✅ Save
        fs.writeFileSync(ECONOMY_PATH, JSON.stringify(db, null, 2));

        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • DEPOSIT*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ *Deposited Successfully!*

💰 Amount: ${amount.toLocaleString()} coins
💵 Wallet: ${user.wallet.toLocaleString()} coins
🏦 Bank: ${user.bank.toLocaleString()} coins

Your coins are safe!

> ֎`,
            mentions: [m.sender]
        }, { quoted: m });

        // ✅ React
        await sock.sendMessage(m.chat, {
            react: { text: "🏦", key: m.key }
        });
    }
};