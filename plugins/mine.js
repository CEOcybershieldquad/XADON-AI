const fs = require('fs');

module.exports = {
    command: 'mine',
    alias: ['mining', 'dig'],
    description: 'Mine for ores and gems to earn coins',
    category: 'economy',
    usage: '.mine',
    cooldown: 10,

    execute: async (sock, m, { reply }) => {

        const ECONOMY_PATH = './database/economy.json';
        const INVENTORY_PATH = './database/inventory.json';

        // ✅ Create database folder if missing
        if (!fs.existsSync('./database')) {
            fs.mkdirSync('./database');
        }

        // ✅ Load or create economy DB
        let economy = {};
        if (fs.existsSync(ECONOMY_PATH)) {
            economy = JSON.parse(fs.readFileSync(ECONOMY_PATH, 'utf8'));
        }

        // ✅ Load or create inventory DB
        let inventory = {};
        if (fs.existsSync(INVENTORY_PATH)) {
            inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
        }

        const userId = m.sender;

        // ✅ Create user if new
        if (!economy[userId]) {
            economy[userId] = {
                wallet: 0,
                bank: 0,
                lastDaily: 0,
                lastWork: 0,
                lastMine: 0,
                totalEarned: 0
            };
        }

        if (!inventory[userId]) {
            inventory[userId] = {};
        }

        const user = economy[userId];
        const userInv = inventory[userId];

        // ✅ Check mine cooldown: 15 minutes
        const now = Date.now();
        const mineCooldown = 15 * 60 * 1000;
        if (now - (user.lastMine || 0) < mineCooldown) {
            const timeLeft = mineCooldown - (now - user.lastMine);
            const minutes = Math.floor(timeLeft / (60 * 1000));
            const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
            return reply(`⛏️ Your pickaxe is resting!\n\nCooldown: ${minutes}m ${seconds}s\n\n> ֎`);
        }

        // ✅ Ore types and chances
        const ores = [
            { name: '🪨 Stone', chance: 0.45, price: 40, id: 'stone' },
            { name: '🪙 Coal', chance: 0.25, price: 100, id: 'coal' },
            { name: '🔶 Copper', chance: 0.15, price: 250, id: 'copper' },
            { name: '⚪ Iron', chance: 0.10, price: 500, id: 'iron' },
            { name: '💎 Diamond', chance: 0.04, price: 1500, id: 'diamond' },
            { name: '🌟 Emerald', chance: 0.01, price: 5000, id: 'emerald' }
        ];

        // ✅ Random mine
        const roll = Math.random();
        let found = null;
        let cumulative = 0;

        for (const ore of ores) {
            cumulative += ore.chance;
            if (roll < cumulative) {
                found = ore;
                break;
            }
        }

        if (!found) {
            user.lastMine = now;
            fs.writeFileSync(ECONOMY_PATH, JSON.stringify(economy, null, 2));
            return reply(`⛏️ You mined... nothing but dirt!\n\nBetter luck next time\n\n> ֎`);
        }

        // ✅ Add to inventory and wallet
        const amount = Math.floor(Math.random() * 3) + 1; // 1-3 ores
        userInv[found.id] = (userInv[found.id] || 0) + amount;
        const totalValue = found.price * amount;

        user.wallet += totalValue;
        user.totalEarned += totalValue;
        user.lastMine = now;

        // ✅ Save
        fs.writeFileSync(ECONOMY_PATH, JSON.stringify(economy, null, 2));
        fs.writeFileSync(INVENTORY_PATH, JSON.stringify(inventory, null, 2));

        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • MINING*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

⛏️ *You mined ${amount}x ${found.name}!*

💰 Value: ${totalValue.toLocaleString()} coins
💵 Wallet: ${user.wallet.toLocaleString()} coins
🎒 Ores added to inventory

> ֎`,
            mentions: [m.sender]
        }, { quoted: m });

        // ✅ React
        await sock.sendMessage(m.chat, {
            react: { text: "⛏️", key: m.key }
        });
    }
};