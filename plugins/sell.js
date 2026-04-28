const fs = require('fs');

module.exports = {
    command: 'sell',
    alias: ['refund'],
    description: 'Sell items from your inventory',
    category: 'economy',
    usage: '.sell <item> [amount]',

    execute: async (sock, m, { args, reply }) => {

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
                totalEarned: 0
            };
        }

        if (!inventory[userId] || Object.keys(inventory[userId]).length === 0) {
            return reply(`❌ You have no items to sell\n\nBuy items with.shop\n\n> ֎`);
        }

        const user = economy[userId];
        const userInv = inventory[userId];

        if (!args[0]) {
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • SELL*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

💰 Sell items for 50% price

Usage:
.sell <item_id> [amount]

Example:
.sell phone
.sell coffee 5

Check.inventory for your items

> ֎`);
        }

        const itemId = args[0].toLowerCase();
        const sellAmount = args[1]? parseInt(args[1]) : 1;

        // ✅ Shop prices - sell for 50%
        const shopPrices = {
            phone: 5000,
            car: 25000,
            house: 100000,
            ring: 15000,
            laptop: 8000,
            padlock: 500,
            pizza: 200,
            coffee: 100
        };

        const itemNames = {
            phone: '📱 iPhone 20',
            car: '🚗 Tesla Cybertruck',
            house: '🏠 Mansion',
            ring: '💍 Diamond Ring',
            laptop: '💻 Gaming Laptop',
            padlock: '🔒 Padlock',
            pizza: '🍕 Pizza',
            coffee: '☕ Coffee'
        };

        // ✅ Check if item exists in shop
        if (!shopPrices[itemId]) {
            return reply(`❌ Item not found in shop\n\nCheck.shop for valid items\n\n> ֎`);
        }

        // ✅ Check if user owns item
        if (!userInv[itemId] || userInv[itemId] < 1) {
            return reply(`❌ You don't own this item\n\nCheck your.inventory\n\n> ֎`);
        }

        if (isNaN(sellAmount) || sellAmount < 1) {
            return reply(`❌ Enter a valid amount\n\n> ֎`);
        }

        if (userInv[itemId] < sellAmount) {
            return reply(`❌ You only have ${userInv[itemId]} ${itemNames[itemId]}\n\n> ֎`);
        }

        // ✅ Calculate sell price - 50% of buy price
        const buyPrice = shopPrices[itemId];
        const sellPrice = Math.floor(buyPrice * 0.5);
        const totalEarned = sellPrice * sellAmount;

        // ✅ Process sale
        userInv[itemId] -= sellAmount;
        if (userInv[itemId] === 0) delete userInv[itemId];

        user.wallet += totalEarned;
        user.totalEarned += totalEarned;

        // ✅ Save
        fs.writeFileSync(ECONOMY_PATH, JSON.stringify(economy, null, 2));
        fs.writeFileSync(INVENTORY_PATH, JSON.stringify(inventory, null, 2));

        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • SELL*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ *Sale Successful!*

🛒 Sold: ${sellAmount}x ${itemNames[itemId]}
💰 Unit Price: ${sellPrice.toLocaleString()} coins
💸 Total Earned: ${totalEarned.toLocaleString()} coins

💵 Wallet: ${user.wallet.toLocaleString()} coins
🎒 Remaining: ${userInv[itemId] || 0}

> ֎`,
            mentions: [m.sender]
        }, { quoted: m });

        // ✅ React
        await sock.sendMessage(m.chat, {
            react: { text: "💰", key: m.key }
        });
    }
};