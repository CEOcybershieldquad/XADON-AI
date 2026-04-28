const fs = require('fs');

module.exports = {
    command: 'cook',
    alias: ['chef', 'grill'],
    description: 'Cook raw fish and meat to increase value',
    category: 'economy',
    usage: '.cook <item> [amount]',
    cooldown: 3,

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

        // ✅ Cooking recipes - raw to cooked
        const recipes = {
            small_fish: { name: '🍳 Grilled Small Fish', cooked: 'grilled_small_fish', value: 100 },
            tropical_fish: { name: '🍳 Grilled Tropical Fish', cooked: 'grilled_tropical_fish', value: 300 },
            shark_fish: { name: '🍳 Shark Steak', cooked: 'shark_steak', value: 900 },
            whale_fish: { name: '🍳 Whale Steak', cooked: 'whale_steak', value: 1800 },
            squid_fish: { name: '🍳 Grilled Squid', cooked: 'grilled_squid', value: 4500 },
            rabbit_meat: { name: '🍖 Rabbit Stew', cooked: 'rabbit_stew', value: 180 },
            deer_meat: { name: '🍖 Venison Steak', cooked: 'venison_steak', value: 450 },
            boar_meat: { name: '🍖 Boar Roast', cooked: 'boar_roast', value: 1000 },
            bear_meat: { name: '🍖 Bear Steak', cooked: 'bear_steak', value: 2200 },
            lion_meat: { name: '🍖 Lion Steak', cooked: 'lion_steak', value: 6500 }
        };

        // ✅ Show cookable items if no args
        if (!args[0]) {
            let cookable = [];
            Object.keys(recipes).forEach(item => {
                if (userInv[item] && userInv[item] > 0) {
                    cookable.push(`${userInv[item]}x ${item.replace('_', ' ')}`);
                }
            });

            if (cookable.length === 0) {
                return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • COOKING*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🍳 Cook raw fish/meat to double value

❌ You have no raw items to cook

Go fishing with.fish
Go hunting with.hunt

Usage:.cook <item> [amount]
Example:.cook shark_fish 2

> ֎`);
            }

            let text = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • COOKING*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🍳 *Cookable Items:*

`;
            Object.keys(recipes).forEach(item => {
                if (userInv[item] && userInv[item] > 0) {
                    const recipe = recipes[item];
                    text += `${recipe.name}\n`;
                    text += ` 📦 Raw: ${userInv[item]}x ${item}\n`;
                    text += ` 💰 Value: ${recipe.value} each\n`;
                    text += ` 🛠️ ID: ${item}\n\n`;
                }
            });

            text += `Usage:.cook <item_id> [amount]\nExample:.cook deer_meat\n\n> ֎`;

            return await sock.sendMessage(m.chat, { text: text }, { quoted: m });
        }

        const itemId = args[0].toLowerCase();
        const cookAmount = args[1]? parseInt(args[1]) : 1;

        // ✅ Check if item can be cooked
        if (!recipes[itemId]) {
            return reply(`❌ Item cannot be cooked\n\nUse.cook to see cookable items\n\n> ֎`);
        }

        // ✅ Check if user owns item
        if (!userInv[itemId] || userInv[itemId] < 1) {
            return reply(`❌ You don't have ${itemId}\n\nGo.fish or.hunt first\n\n> ֎`);
        }

        if (isNaN(cookAmount) || cookAmount < 1) {
            return reply(`❌ Enter a valid amount\n\n> ֎`);
        }

        if (userInv[itemId] < cookAmount) {
            return reply(`❌ You only have ${userInv[itemId]}x ${itemId}\n\n> ֎`);
        }

        // ✅ Cook item
        const recipe = recipes[itemId];
        const totalValue = recipe.value * cookAmount;

        userInv[itemId] -= cookAmount;
        if (userInv[itemId] === 0) delete userInv[itemId];

        userInv[recipe.cooked] = (userInv[recipe.cooked] || 0) + cookAmount;

        // ✅ Auto sell cooked food for coins
        user.wallet += totalValue;
        user.totalEarned += totalValue;

        // ✅ Save
        fs.writeFileSync(ECONOMY_PATH, JSON.stringify(economy, null, 2));
        fs.writeFileSync(INVENTORY_PATH, JSON.stringify(inventory, null, 2));

        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • COOKING*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🍳 *Cooking Successful!*

✅ Cooked: ${cookAmount}x ${recipe.name}
💰 Sold for: ${totalValue.toLocaleString()} coins
💵 Wallet: ${user.wallet.toLocaleString()} coins

Cooking doubles the value!

> ֎`,
            mentions: [m.sender]
        }, { quoted: m });

        // ✅ React
        await sock.sendMessage(m.chat, {
            react: { text: "🍳", key: m.key }
        });
    }
};