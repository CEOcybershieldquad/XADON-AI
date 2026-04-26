const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/afk.json');

// Create database if it doesn't exist
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
}

const getAfkData = () => {
    try {
        return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
        return {};
    }
};

const saveAfkData = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = {
    command: 'afk',
    alias: ['afk'],
    description: 'Set yourself as Away From Keyboard with optional reason',
    category: 'utility',
    usage: '.afk [reason]',

    execute: async (sock, m, { args, reply }) => {
        if (!m.isGroup && !m.isPrivate) {
            return reply('❌ AFK works in groups and private chats\n> XADON AI');
        }

        const userId = m.sender;
        let data = getAfkData();
        const reason = args.join(' ') || 'No reason provided';

        if (!data[userId]) data[userId] = {};

        data[userId] = {
            status: true,
            reason: reason,
            time: Date.now(),
            chatId: m.chat // for better context
        };

        saveAfkData(data);

        const timeStr = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

        await reply(`✅ *${m.pushName || 'User'}* is now **AFK**\n\n📝 Reason: ${reason}\n⏰ Since: ${timeStr}\n\nI'll auto-reply when someone mentions you.\n> XADON AI`);
    }
};