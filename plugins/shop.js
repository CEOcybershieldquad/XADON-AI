const fs = require('fs');

module.exports = {
    command: 'shop',
    alias: ['store', 'buy', 'items'],
    description: 'Buy items from XADON AI Shop',
    category: 'economy',
    usage: '.shop [buy <item>]',

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

        if (!inventory[userId]) {
            inventory[userId] = {};
        }

        const user = economy[userId];
        const userInv = inventory[userId];

        // ✅ Shop items
        const shopItems = {
            phone: { name: '📱 iPhone 20', price: 5000, desc: 'Flex on broke people' },
            car: { name: '🚗 Tesla Cybertruck', price: 25000, desc: 'Drive in style' },
            house: { name: '🏠 Mansion', price: 100000, desc: 'Live like a king' },
            ring: { name: '💍 Diamond Ring', price: 15000, desc: 'Propose to your crush' },
            laptop: { name: '💻 Gaming Laptop', price: 8000, desc: 'For coding XADON AI' },
            padlock: { name: '🔒 Padlock', price: 500, desc: 'Protect from robbers 1 time' },
            pizza: { name: '🍕 Pizza', price: 200, desc: 'Just for vibes' },
            coffee: { name: '☕ Coffee', price: 100, desc: 'Stay awake coding' }
        };

        // ✅ Show shop if no buy command
        if (!args[0] || args[0].toLowerCase()!== 'buy') {
            let text = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • SHOP*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

💵 Your Wallet: ${user.wallet.toLocaleString()} coins

*Items for sale:*

`;
            Object.keys(shopItems).forEach(id => {
                const item = shopItems[id];
                const owned = userInv[id] || 0;
                text += `${item.name}\n`;
                text += ` 💰 Price: ${item.price.toLocaleString()} coins\n`;
                text += ` 📝 ${item.desc}\n`;
                text += ` 🎒 You own: ${owned}\n`;
                text += ` 🛒 ID: ${id}\n\n`;
            });

            text += `Usage:.shop buy <item_id>\nExample:.shop buy phone\n\n> ֎`;

            return await sock.sendMessage(m.chat, { text: text }, { quoted: m });
        }

        // ✅ Buy item
        const itemId = args[1]?.toLowerCase();
        if (!itemId ||!shopItems[itemId]) {
            return reply(`❌ Item not found\n\nUse.shop to see items\n\n> ֎`);
        }

        const item = shopItems[itemId];

        if (user.wallet < item.price) {
            return reply(`❌ Not enough coins\n\n💰 Price: ${item.price.toLocaleString()} coins\n💵 Wallet: ${user.wallet.toLocaleString()} coins\n\n> ֎`);
        }

        // ✅ Process purchase
        user.wallet -= item.price;
        userInv[itemId] = (userInv[itemId] || 0) + 1;

        // ✅ Save
        fs.writeFileSync(ECONOMY_PATH, JSON.stringify(economy, null, 2));
        fs.writeFileSync(INVENTORY_PATH, JSON.stringify(inventory, null, 2));

        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • PURCHASE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ *Purchase Successful!*

🛒 Item: ${item.name}
💰 Price: ${item.price.toLocaleString()} coins
🎒 You now own: ${userInv[itemId]}

💵 Wallet: ${user.wallet.toLocaleString()} coins

Enjoy your item!

> ֎`,
            mentions: [m.sender]
        }, { quoted: m });

        // ✅ React
        await sock.sendMessage(m.chat, {
            react: { text: "🛒", key: m.key }
        });
    }
};