const fs = require('fs');
const path = require('path');

module.exports = {
    command: 'balance',
    alias: ['bal', 'money', 'wallet', 'bank'],
    description: 'Check your economy balance',
    category: 'economy',
    usage: '.balance [@user]',

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

        // ✅ Get target user
        let target = m.sender;
        if (args[0]) {
            target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        }

        const mention = m.mentionedJid && m.mentionedJid[0]? m.mentionedJid[0] : target;

        // ✅ Create user if new
        if (!db[mention]) {
            db[mention] = {
                wallet: 0,
                bank: 0,
                lastDaily: 0,
                lastWork: 0,
                totalEarned: 0
            };
            fs.writeFileSync(ECONOMY_PATH, JSON.stringify(db, null, 2));
        }

        const user = db[mention];
        const total = user.wallet + user.bank;
        const name = mention === m.sender? 'You' : `@${mention.split('@')[0]}`;

        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • BANK*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

👤 *User:* ${name}
💵 *Wallet:* ${user.wallet.toLocaleString()} coins
🏦 *Bank:* ${user.bank.toLocaleString()} coins
💰 *Total:* ${total.toLocaleString()} coins

> ֎`,
            mentions: mention!== m.sender? [mention] : []
        }, { quoted: m });

        // ✅ React
        await sock.sendMessage(m.chat, {
            react: { text: "💰", key: m.key }
        });
    }
};