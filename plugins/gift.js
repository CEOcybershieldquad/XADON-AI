const fs = require('fs');

module.exports = {
    command: 'gift',
    alias: ['giveitem', 'senditem'],
    description: 'Gift items from your inventory to another user',
    category: 'economy',
    usage: '.gift @user <item_id> [amount]',

    execute: async (sock, m, { args, reply }) => {

        const INVENTORY_PATH = './database/inventory.json';

        if (!fs.existsSync('./database')) {
            fs.mkdirSync('./database');
        }

        let inventory = {};
        if (fs.existsSync(INVENTORY_PATH)) {
            inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
        }

        const senderId = m.sender;

        if (!inventory[senderId]) {
            return reply(`❌ You have no items to gift\n\n> ֎`);
        }

        // ✅ Get target
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentioned.length === 0) {
            return reply(`❌ Tag someone to gift\n\nUsage:.gift @user <item> [amount]\n\n> ֎`);
        }

        const targetId = mentioned[0];
        if (targetId === senderId) {
            return reply(`❌ You can't gift yourself\n\n> ֎`);
        }

        if (!args[1]) {
            return reply(`❌ Specify item to gift\n\nUsage:.gift @user <item> [amount]\n\n> ֎`);
        }

        const itemId = args[1].toLowerCase();
        const amount = args[2]? parseInt(args[2]) : 1;

        if (isNaN(amount) || amount < 1) {
            return reply(`❌ Enter valid amount\n\n> ֎`);
        }

        const senderInv = inventory[senderId];
        if (!senderInv[itemId] || senderInv[itemId] < amount) {
            return reply(`❌ You don't have ${amount}x ${itemId}\n\nYou have: ${senderInv[itemId] || 0}\n\n> ֎`);
        }

        // ✅ Transfer item
        if (!inventory[targetId]) inventory[targetId] = {};

        senderInv[itemId] -= amount;
        if (senderInv[itemId] === 0) delete senderInv[itemId];

        inventory[targetId][itemId] = (inventory[targetId][itemId] || 0) + amount;

        fs.writeFileSync(INVENTORY_PATH, JSON.stringify(inventory, null, 2));

        await sock.sendMessage(m.chat, {
            text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • XADON AI • GIFT*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🎁 *Gift Sent!*

From: @${senderId.split('@')[0]}
To: @${targetId.split('@')[0]}
Item: ${amount}x ${itemId}

> ֎`,
            mentions: [senderId, targetId]
        }, { quoted: m });

        await sock.sendMessage(m.chat, {
            react: { text: "🎁", key: m.key }
        });
    }
};