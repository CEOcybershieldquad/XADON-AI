const fs = require('fs');

module.exports = {
    command: 'pay',
    alias: ['transfer', 'give', 'send'],
    description: 'Pay coins to another user',
    category: 'economy',
    usage: '.pay @user <amount>',

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

        const senderId = m.sender;

        // ✅ Create sender if new
        if (!db[senderId]) {
            db[senderId] = {
                wallet: 0,
                bank: 0,
                lastDaily: 0,
                lastWork: 0,
                totalEarned: 0
            };
        }

        // ✅ Check args
        if (!args[0] ||!args[1]) {
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • PAY*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

💸 Transfer coins to users

Usage:
.pay @user <amount>

Example:
.pay @user 1000

💵 Your Wallet: ${db[senderId].wallet.toLocaleString()} coins

> ֎`);
        }

        // ✅ Get receiver
        let receiverId;
        if (m.mentionedJid && m.mentionedJid[0]) {
            receiverId = m.mentionedJid[0];
        } else {
            receiverId = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        }

        if (receiverId === senderId) {
            return reply(`❌ You can't pay yourself\n\n> ֎`);
        }

        if (receiverId === sock.user.id) {
            return reply(`❌ You can't pay the bot\n\n> ֎`);
        }

        // ✅ Parse amount
        const amount = parseInt(args[1].replace(/,/g, ''));

        if (isNaN(amount) || amount < 1) {
            return reply(`❌ Enter a valid amount\n\nExample:.pay @user 500\n\n> ֎`);
        }

        if (db[senderId].wallet < amount) {
            return reply(`❌ Not enough coins in wallet\n\n💵 Wallet: ${db[senderId].wallet.toLocaleString()} coins\n\n> ֎`);
        }

        // ✅ Create receiver if new
        if (!db[receiverId]) {
            db[receiverId] = {
                wallet: 0,
                bank: 0,
                lastDaily: 0,
                lastWork: 0,
                totalEarned: 0
            };
        }

        // ✅ Transfer coins
        db[senderId].wallet -= amount;
        db[receiverId].wallet += amount;
        db[receiverId].totalEarned += amount;

        // ✅ Save
        fs.writeFileSync(ECONOMY_PATH, JSON.stringify(db, null, 2));

        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • PAY*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ *Payment Successful!*

💸 Amount: ${amount.toLocaleString()} coins
👤 To: @${receiverId.split('@')[0]}

💵 Your Wallet: ${db[senderId].wallet.toLocaleString()} coins

> ֎`,
            mentions: [senderId, receiverId]
        }, { quoted: m });

        // ✅ React
        await sock.sendMessage(m.chat, {
            react: { text: "💸", key: m.key }
        });

        // ✅ Notify receiver
        try {
            await sock.sendMessage(receiverId, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • PAY*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

💰 You received ${amount.toLocaleString()} coins
👤 From: @${senderId.split('@')[0]}

💵 Your Wallet: ${db[receiverId].wallet.toLocaleString()} coins

> ֎`,
                mentions: [senderId]
            });
        } catch (e) {
            // User might have blocked bot or private chat disabled
        }
    }
};