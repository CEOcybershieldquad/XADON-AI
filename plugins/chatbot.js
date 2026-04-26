const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'database', 'chatbot.json');

function loadDB() {
    if (!fs.existsSync(DB_PATH)) return {};
    return JSON.parse(fs.readFileSync(DB_PATH));
}

function saveDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
    command: 'chatbot',
    alias: ['xadonai'],
    category: 'ai',
    desc: 'Control XADON AI chatbot',

    execute: async (sock, m, { args, reply }) {

        if (!m.isGroup) return reply('⚠️ Group only');

        const db = loadDB();
        const group = m.chat;

        if (!db[group]) db[group] = { enabled: false };

        const cmd = args[0]?.toLowerCase();

        if (!cmd) {
            return reply(
`╭━━━〔 🤖 XADON AI 〕━━━⬣
┃ Status: ${db[group].enabled ? 'ON ✅' : 'OFF ❌'}
┃
┃ Commands:
┃ • .chatbot on
┃ • .chatbot off
╰━━━━━━━━━━━━━━⬣`
            );
        }

        if (cmd === 'on') {
            db[group].enabled = true;
            saveDB(db);
            return reply('✅ XADON AI Enabled');
        }

        if (cmd === 'off') {
            db[group].enabled = false;
            saveDB(db);
            return reply('❌ XADON AI Disabled');
        }
    }
};