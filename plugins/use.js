const fs = require('fs');

module.exports = {
    command: 'use',
    alias: ['consume', 'activate'],
    description: 'Use items from your inventory',
    category: 'economy',
    usage: '.use <item>',

    execute: async (sock, m, { args, reply }) => {

        const INVENTORY_PATH = './database/inventory.json';
        const EFFECTS_PATH = './database/effects.json';

        // ✅ Create database folder if missing
        if (!fs.existsSync('./database')) {
            fs.mkdirSync('./database');
        }

        // ✅ Load or create inventory DB
        let inventory = {};
        if (fs.existsSync(INVENTORY_PATH)) {
            inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
        }

        // ✅ Load or create effects DB
        let effects = {};
        if (fs.existsSync(EFFECTS_PATH)) {
            effects = JSON.parse(fs.readFileSync(EFFECTS_PATH, 'utf8'));
        }

        const userId = m.sender;

        if (!inventory[userId] || Object.keys(inventory[userId]).length === 0) {
            return reply(`❌ You have no items\n\nBuy items with.shop\n\n> ֎`);
        }

        const userInv = inventory[userId];

        if (!args[0]) {
            return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • USE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🎒 Use items from inventory

Usage:
.use <item_id>

Usable items:
🔒 padlock - Blocks next rob
☕ coffee - Reduces work cooldown
🍕 pizza - Just for vibes

Check.shop for item IDs

> ֎`);
        }

        const itemId = args[0].toLowerCase();

        // ✅ Check if user owns item
        if (!userInv[itemId] || userInv[itemId] < 1) {
            return reply(`❌ You don't own this item\n\nCheck your.inventory\n\n> ֎`);
        }

        // ✅ Usable items effects
        const usableItems = {
            padlock: {
                name: '🔒 Padlock',
                effect: async () => {
                    if (!effects[userId]) effects[userId] = {};
                    effects[userId].padlock = true;
                    return `🔒 *Padlock Activated!*\n\nThe next person who tries to rob you will fail automatically.\n\n*It's for fun ooh* 😀😀`;
                }
            },
            coffee: {
                name: '☕ Coffee',
                effect: async () => {
                    const ECONOMY_PATH = './database/economy.json';
                    if (fs.existsSync(ECONOMY_PATH)) {
                        const economy = JSON.parse(fs.readFileSync(ECONOMY_PATH, 'utf8'));
                        if (economy[userId]) {
                            // Reduce work cooldown by 5 mins
                            economy[userId].lastWork = economy[userId].lastWork - (5 * 60 * 1000);
                            fs.writeFileSync(ECONOMY_PATH, JSON.stringify(economy, null, 2));
                        }
                    }
                    return `☕ *Coffee Drank!*\n\nYou're energized! Work cooldown reduced by 5 minutes.`;
                }
            },
            pizza: {
                name: '🍕 Pizza',
                effect: async () => {
                    const messages = [
                        'You ate the pizza. It was mid.',
                        'Delicious! You feel happy for 5 seconds.',
                        'You shared with the bot. Thanks!',
                        'Pizza time! *nom nom nom*',
                        'Best pizza in Lagos!'
                    ];
                    return `🍕 *Pizza Eaten!*\n\n${messages[Math.floor(Math.random() * messages.length)]}`;
                }
            }
        };

        // ✅ Check if item is usable
        if (!usableItems[itemId]) {
            return reply(`❌ This item can't be used\n\nUsable: padlock, coffee, pizza\n\n> ֎`);
        }

        // ✅ Use item
        userInv[itemId] -= 1;
        if (userInv[itemId] === 0) delete userInv[itemId];

        const effectText = await usableItems[itemId].effect();

        // ✅ Save
        fs.writeFileSync(INVENTORY_PATH, JSON.stringify(inventory, null, 2));
        fs.writeFileSync(EFFECTS_PATH, JSON.stringify(effects, null, 2));

        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • USE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

${effectText}

🎒 Remaining: ${userInv[itemId] || 0}

> ֎`,
            mentions: [m.sender]
        }, { quoted: m });

        // ✅ React
        await sock.sendMessage(m.chat, {
            react: { text: "✅", key: m.key }
        });
    }
};