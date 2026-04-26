const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/reacts.json');

// Create database if not exists
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({
        triggers: {
            "cybershield squad": "🛡️",
            "defenders 001": "⚡",
            "defenders 002": "🔥",
            "defenders 003": "💎",
            "xadon!": "✨"
        }
    }, null, 2));
}

const getReactData = () => {
    try {
        return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
        return { triggers: {} };
    }
};

const saveReactData = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = {
    command: 'setreact',
    alias: ['setreact', 'reactset'],
    description: 'Set custom emoji reaction for specific text trigger',
    category: 'owner',
    usage: '.setreact <emoji> <trigger text>\nExample: .setreact 😂 My love',

    execute: async (sock, m, { args, reply, isAdmin }) => {
        if (!m.isGroup) return reply('❌ This works best in groups\n> XADON AI');

        // Only admins can set reacts (you can change to owner only if you want)
        if (!m.isAdmin) return reply('❌ Only group admins can set reacts\n> XADON AI');

        if (args.length < 2) {
            return reply(`✪ *XADON AI • CUSTOM REACT SYSTEM* ✪

Usage: .setreact <emoji> <trigger text>

Example:
.setreact 😂 My love
.setreact 🔥 Hello boss

Default triggers:
• Cybershield squad → 🛡️
• Defenders 001 → ⚡
• Defenders 002 → 🔥
• Defenders 003 → 💎
• Xadon! → ✨

> Bot will react instantly when trigger is typed
> XADON AI`);
        }

        const emoji = args[0];                    // First argument = emoji
        const trigger = args.slice(1).join(' ').toLowerCase().trim(); // Rest = trigger text

        if (!emoji || emoji.length > 5) { // simple emoji check
            return reply('⚠️ Please provide a valid emoji as first argument\n> XADON AI');
        }

        let data = getReactData();
        if (!data.triggers) data.triggers = {};

        data.triggers[trigger] = emoji;
        saveReactData(data);

        return reply(`✅ Custom react set successfully!\n\nTrigger: *${trigger}*\nReaction: ${emoji}\n\nBot will now react when someone types this.\n> XADON AI`);
    }
};