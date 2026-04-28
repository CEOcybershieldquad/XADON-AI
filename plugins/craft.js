const fs = require('fs');

module.exports = {
    command: 'craft',
    alias: ['combine', 'make'],
    description: 'Craft new items from materials',
    category: 'economy',
    usage: '.craft [recipe]',

    execute: async (sock, m, { args, reply }) => {

        const INVENTORY_PATH = './database/inventory.json';

        // ✅ Create database folder if missing
        if (!fs.existsSync('./database')) {
            fs.mkdirSync('./database');
        }

        // ✅ Load or create inventory DB
        let inventory = {};
        if (fs.existsSync(INVENTORY_PATH)) {
            inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
        }

        const userId = m.sender;

        if (!inventory[userId]) {
            inventory[userId] = {};
        }

        const userInv = inventory[userId];

        // ✅ Crafting recipes
        const recipes = {
            computer: {
                name: '🖥️ Gaming PC',
                materials: { laptop: 1, phone: 1 },
                desc: 'Combine laptop + phone to build a PC'
            },
            mansion: {
                name: '🏰 Castle',
                materials: { house: 2, car: 1 },
                desc: 'Combine 2 mansions + car to build a castle'
            },
            bundle: {
                name: '🎁 Mystery Box',
                materials: { pizza: 3, coffee: 3 },
                desc: 'Combine 3 pizza + 3 coffee for surprise'
            },
            key: {
                name: '🗝️ Master Key',
                materials: { padlock: 5 },
                desc: 'Combine 5 padlocks to make a master key'
            }
        };

        // ✅ Show recipes if no args
        if (!args[0]) {
            let text = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • CRAFTING*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🔨 Combine items to craft new ones

*Available Recipes:*

`;
            Object.keys(recipes).forEach(id => {
                const recipe = recipes[id];
                text += `${recipe.name}\n`;
                text += ` 📝 ${recipe.desc}\n`;
                text += ` 📦 Materials: `;
                const mats = Object.keys(recipe.materials).map(mat => `${recipe.materials[mat]}x ${mat}`).join(', ');
                text += `${mats}\n`;
                text += ` 🛠️ ID: ${id}\n\n`;
            });

            text += `Usage:.craft <recipe_id>\nExample:.craft computer\n\n> ֎`;

            return await sock.sendMessage(m.chat, { text: text }, { quoted: m });
        }

        const recipeId = args[0].toLowerCase();

        // ✅ Check if recipe exists
        if (!recipes[recipeId]) {
            return reply(`❌ Recipe not found\n\nUse.craft to see recipes\n\n> ֎`);
        }

        const recipe = recipes[recipeId];

        // ✅ Check if user has materials
        const missing = [];
        Object.keys(recipe.materials).forEach(mat => {
            const needed = recipe.materials[mat];
            const owned = userInv[mat] || 0;
            if (owned < needed) {
                missing.push(`${needed}x ${mat} (you have ${owned})`);
            }
        });

        if (missing.length > 0) {
            return reply(`❌ Missing materials:\n\n${missing.join('\n')}\n\n> ֎`);
        }

        // ✅ Craft item - remove materials
        Object.keys(recipe.materials).forEach(mat => {
            userInv[mat] -= recipe.materials[mat];
            if (userInv[mat] === 0) delete userInv[mat];
        });

        // ✅ Add crafted item
        userInv[recipeId] = (userInv[recipeId] || 0) + 1;

        // ✅ Save
        fs.writeFileSync(INVENTORY_PATH, JSON.stringify(inventory, null, 2));

        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • CRAFTING*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ *Crafting Successful!*

🔨 Crafted: ${recipe.name}
🎒 You now own: ${userInv[recipeId]}

Materials used:
${Object.keys(recipe.materials).map(mat => ` • ${recipe.materials[mat]}x ${mat}`).join('\n')}

> ֎`,
            mentions: [m.sender]
        }, { quoted: m });

        // ✅ React
        await sock.sendMessage(m.chat, {
            react: { text: "🔨", key: m.key }
        });
    }
};