const fs = require('fs');

module.exports = {
    command: 'hunt',
    alias: ['hunting', 'track'],
    description: 'Go hunting for animals to earn coins',
    category: 'economy',
    usage: '.hunt',
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
                lastHunt: 0,
                totalEarned: 0
            };
        }

        if (!inventory[userId]) {
            inventory[userId] = {};
        }

        const user = economy[userId];
        const userInv = inventory[userId];

        // ✅ Check hunt cooldown: 12 minutes
        const now = Date.now();
        const huntCooldown = 12 * 60 * 1000;
        if (now - (user.lastHunt || 0) < huntCooldown) {
            const timeLeft = huntCooldown - (now - user.lastHunt);
            const minutes = Math.floor(timeLeft / (60 * 1000));
            const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
            return reply(`🏹 Animals are hiding!\n\nCooldown: ${minutes}m ${seconds}s\n\n> ֎`);
        }

        // ✅ Animal types and chances
        const animals = [
            { name: '🐇 Rabbit', chance: 0.40, price: 80, id: 'rabbit_meat' },
            { name: '🦌 Deer', chance: 0.30, price: 200, id: 'deer_meat' },
            { name: '🐗 Boar', chance: 0.18, price: 450, id: 'boar_meat' },
            { name: '🐻 Bear', chance: 0.09, price: 1000, id: 'bear_meat' },
            { name: '🦁 Lion', chance: 0.03, price: 3000, id: 'lion_meat' }
        ];

        // ✅ Random hunt
        const roll = Math.random();
        let caught = null;
        let cumulative = 0;

        for (const animal of animals) {
            cumulative += animal.chance;
            if (roll < cumulative) {
                caught = animal;
                break;
            }
        }

        if (!caught) {
            user.lastHunt = now;
            fs.writeFileSync(ECONOMY_PATH, JSON.stringify(economy, null, 2));
            return reply(`🏹 You tracked... nothing!\n\nThe forest is quiet today\n\n> ֎`);
        }

        // ✅ Add to inventory and wallet
        const amount = Math.floor(Math.random() * 2) + 1; // 1-2 meat
        userInv[caught.id] = (userInv[caught.id] || 0) + amount;
        const totalValue = caught.price * amount;

        user.wallet += totalValue;
        user.totalEarned += totalValue;
        user.lastHunt = now;

        // ✅ Save
        fs.writeFileSync(ECONOMY_PATH, JSON.stringify(economy, null, 2));
        fs.writeFileSync(INVENTORY_PATH, JSON.stringify(inventory, null, 2));

        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • HUNTING*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🏹 *You hunted a ${caught.name}!*

🥩 Meat: ${amount}x ${caught.name} meat
💰 Sold for: ${totalValue.toLocaleString()} coins
💵 Wallet: ${user.wallet.toLocaleString()} coins
🎒 Meat added to inventory

> ֎`,
            mentions: [m.sender]
        }, { quoted: m });

        // ✅ React
        await sock.sendMessage(m.chat, {
            react: { text: "🏹", key: m.key }
        });
    }
};