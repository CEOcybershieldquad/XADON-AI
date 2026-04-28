const fs = require('fs');

module.exports = {
    command: 'fish',
    alias: ['fishing', 'catch'],
    description: 'Go fishing to earn coins',
    category: 'economy',
    usage: '.fish',
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
                lastFish: 0,
                totalEarned: 0
            };
        }

        if (!inventory[userId]) {
            inventory[userId] = {};
        }

        const user = economy[userId];
        const userInv = inventory[userId];

        // ✅ Check fish cooldown: 10 minutes
        const now = Date.now();
        const fishCooldown = 10 * 60 * 1000;
        if (now - (user.lastFish || 0) < fishCooldown) {
            const timeLeft = fishCooldown - (now - user.lastFish);
            const minutes = Math.floor(timeLeft / (60 * 1000));
            const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
            return reply(`🎣 Fish are still scared!\n\nCooldown: ${minutes}m ${seconds}s\n\n> ֎`);
        }

        // ✅ Fish types and chances
        const fishes = [
            { name: '🐟 Small Fish', chance: 0.50, price: 50 },
            { name: '🐠 Tropical Fish', chance: 0.25, price: 150 },
            { name: '🦈 Shark', chance: 0.15, price: 400 },
            { name: '🐋 Whale', chance: 0.08, price: 800 },
            { name: '🦑 Giant Squid', chance: 0.02, price: 2000 }
        ];

        // ✅ Random catch
        const roll = Math.random();
        let caught = null;
        let cumulative = 0;

        for (const fish of fishes) {
            cumulative += fish.chance;
            if (roll < cumulative) {
                caught = fish;
                break;
            }
        }

        if (!caught) {
            user.lastFish = now;
            fs.writeFileSync(ECONOMY_PATH, JSON.stringify(economy, null, 2));
            return reply(`🎣 You caught... nothing!\n\nBetter luck next time\n\n> ֎`);
        }

        // ✅ Add to inventory and wallet
        const fishId = caught.name.split(' ')[1].toLowerCase() + '_fish';
        userInv[fishId] = (userInv[fishId] || 0) + 1;
        user.wallet += caught.price;
        user.totalEarned += caught.price;
        user.lastFish = now;

        // ✅ Save
        fs.writeFileSync(ECONOMY_PATH, JSON.stringify(economy, null, 2));
        fs.writeFileSync(INVENTORY_PATH, JSON.stringify(inventory, null, 2));

        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • FISHING*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🎣 *You caught a ${caught.name}!*

💰 Sold for: ${caught.price.toLocaleString()} coins
💵 Wallet: ${user.wallet.toLocaleString()} coins
🎒 Fish added to inventory

> ֎`,
            mentions: [m.sender]
        }, { quoted: m });

        // ✅ React
        await sock.sendMessage(m.chat, {
            react: { text: "🎣", key: m.key }
        });
    }
};