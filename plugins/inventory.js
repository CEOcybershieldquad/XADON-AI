const fs = require('fs');

module.exports = {
    command: 'inventory',
    alias: ['inv', 'bag', 'items'],
    description: 'Check your inventory',
    category: 'economy',
    usage: '.inventory [@user]',

    execute: async (sock, m, { reply }) => {

        const INVENTORY_PATH = './database/inventory.json';

        // ✅ Check if inventory exists
        if (!fs.existsSync(INVENTORY_PATH)) {
            return reply(`❌ No inventory yet\n\nBuy items with.shop\n\n> ֎`);
        }

        // ✅ Load inventory DB
        const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));

        // ✅ Check whose inventory to view
        let targetId = m.sender;
        if (m.mentionedJid && m.mentionedJid[0]) {
            targetId = m.mentionedJid[0];
        }

        const userInv = inventory[targetId];

        if (!userInv || Object.keys(userInv).length === 0) {
            const name = targetId === m.sender? 'You have' : `@${targetId.split('@')[0]} has`;
            return reply(`❌ ${name} no items yet\n\nBuy items with.shop\n\n> ֎`);
        }

        // ✅ Item details for display
        const itemDetails = {
            phone: { name: '📱 iPhone 20', desc: 'Flex on broke people' },
            car: { name: '🚗 Tesla Cybertruck', desc: 'Drive in style' },
            house: { name: '🏠 Mansion', desc: 'Live like a king' },
            ring: { name: '💍 Diamond Ring', desc: 'Propose to your crush' },
            laptop: { name: '💻 Gaming Laptop', desc: 'For coding XADON AI' },
            padlock: { name: '🔒 Padlock', desc: 'Blocks next rob attempt' },
            pizza: { name: '🍕 Pizza', desc: 'Just for vibes' },
            coffee: { name: '☕ Coffee', desc: 'Stay awake coding' }
        };

        // ✅ Build inventory text
        const name = targetId === m.sender? 'Your' : `@${targetId.split('@')[0]}'s`;
        let text = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • INVENTORY*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🎒 *${name} Inventory:*

`;

        let totalItems = 0;
        const mentions = targetId === m.sender? [] : [targetId];

        Object.keys(userInv).forEach(itemId => {
            const count = userInv[itemId];
            if (count > 0 && itemDetails[itemId]) {
                const item = itemDetails[itemId];
                text += `${item.name}\n`;
                text += ` 📦 Quantity: ${count}\n`;
                text += ` 📝 ${item.desc}\n\n`;
                totalItems += count;
            }
        });

        text += `📊 Total Items: ${totalItems}\n\n> ֎`;

        await sock.sendMessage(m.chat, {
            text: text,
            mentions: mentions
        }, { quoted: m });

        // ✅ React
        await sock.sendMessage(m.chat, {
            react: { text: "🎒", key: m.key }
        });
    }
};