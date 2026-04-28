const fs = require('fs');

module.exports = {
    command: 'shop2',
    alias: ['premium', 'shopv2'],
    description: 'Buy premium items and upgrades',
    category: 'economy',
    usage: '.shop2 [buy] [item_id] [amount]',

    execute: async (sock, m, { args, reply }) => {

        const ECONOMY_PATH = './database/economy.json';
        const INVENTORY_PATH = './database/inventory.json';
        const FARM_PATH = './database/farm.json';

        // ✅ Create database folder if missing
        if (!fs.existsSync('./database')) {
            fs.mkdirSync('./database');
        }

        // ✅ Load databases
        let economy = {};
        let inventory = {};
        let farm = {};

        if (fs.existsSync(ECONOMY_PATH)) {
            economy = JSON.parse(fs.readFileSync(ECONOMY_PATH, 'utf8'));
        }
        if (fs.existsSync(INVENTORY_PATH)) {
            inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
        }
        if (fs.existsSync(FARM_PATH)) {
            farm = JSON.parse(fs.readFileSync(FARM_PATH, 'utf8'));
        }

        const userId = m.sender;

        // ✅ Create user if new
        if (!economy[userId]) {
            economy[userId] = { wallet: 0, bank: 0, totalEarned: 0 };
        }
        if (!inventory[userId]) inventory[userId] = {};
        if (!farm[userId]) farm[userId] = { crops: {}, plots: 3 };

        const user = economy[userId];
        const userInv = inventory[userId];
        const userFarm = farm[userId];

        // ✅ Premium shop items
        const items = {
            pickaxe: { name: '💎 Diamond Pickaxe', price: 50000, desc: 'Mine cooldown -5min', type: 'tool' },
            rod: { name: '🎣 Pro Fishing Rod', price: 30000, desc: 'Fish cooldown -3min', type: 'tool' },
            bow: { name: '🏹 Hunter Bow', price: 40000, desc: 'Hunt cooldown -4min', type: 'tool' },
            plot: { name: '🌱 Farm Plot', price: 25000, desc: '+1 farm plot', type: 'upgrade' },
            vault: { name: '🔐 Bank Vault', price: 100000, desc: 'Bank limit +500k', type: 'upgrade' },
            luck: { name: '🍀 Lucky Charm', price: 75000, desc: '+10% brainstorm win rate', type: 'boost' }
        };

        // ✅ Show shop if no args
        if (!args[0]) {
            let text = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • PREMIUM SHOP*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

💎 *Premium Items & Upgrades*

`;
            Object.keys(items).forEach(id => {
                const item = items[id];
                text += `${item.name}\n`;
                text += ` 📝 ${item.desc}\n`;
                text += ` 💰 Price: ${item.price.toLocaleString()} coins\n`;
                text += ` 🛒 ID: ${id}\n\n`;
            });

            text += `💵 Wallet: ${user.wallet.toLocaleString()}\n\n`;
            text += `Usage:.shop2 buy <item_id>\nExample:.shop2 buy pickaxe\n\n> ֎`;

            return await sock.sendMessage(m.chat, { text: text }, { quoted: m });
        }

        // ✅ Buy item
        if (args[0].toLowerCase() === 'buy') {
            const itemId = args[1]?.toLowerCase();
            if (!itemId ||!items[itemId]) {
                return reply(`❌ Invalid item\n\nUse.shop2 to see items\n\n> ֎`);
            }

            const item = items[itemId];

            if (user.wallet < item.price) {
                return reply(`❌ Not enough coins\n\nCost: ${item.price.toLocaleString()}\n💵 Wallet: ${user.wallet.toLocaleString()}\n\n> ֎`);
            }

            // ✅ Process upgrades
            if (itemId === 'plot') {
                if (userFarm.plots >= 10) {
                    return reply(`❌ Max farm plots reached: 10/10\n\n> ֎`);
                }
                userFarm.plots += 1;
                fs.writeFileSync(FARM_PATH, JSON.stringify(farm, null, 2));
            } else if (itemId === 'vault') {
                user.bankLimit = (user.bankLimit || 1000000) + 500000;
            }

            // ✅ Give item
            user.wallet -= item.price;
            userInv[itemId] = (userInv[itemId] || 0) + 1;

            fs.writeFileSync(ECONOMY_PATH, JSON.stringify(economy, null, 2));
            fs.writeFileSync(INVENTORY_PATH, JSON.stringify(inventory, null, 2));

            await sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • PREMIUM SHOP*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ *Purchase Successful!*

🛒 Bought: ${item.name}
💰 Paid: ${item.price.toLocaleString()} coins
💵 Wallet: ${user.wallet.toLocaleString()} coins
📦 ${item.desc}

> ֎`,
                mentions: [m.sender]
            }, { quoted: m });

            return await sock.sendMessage(m.chat, {
                react: { text: "💎", key: m.key }
            });
        }

        return reply(`❌ Usage:.shop2 buy <item_id>\n\n> ֎`);
    }
};