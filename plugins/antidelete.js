const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/antidelete.json');

if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
}

const getData = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const saveData = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

module.exports = {
    command: 'antidelete',
    alias: ['antidel'],
    description: 'Manage Anti-Delete system',
    category: 'antis',

    execute: async (sock, m, { args, reply }) => {
    

        const chatId = m.chat;
        const data = getData();

        if (!data[chatId]) {
            data[chatId] = {
                status: false,
                action: 'notify'
            };
        }

        const settings = data[chatId];

        if (!args[0]) {
            return reply(`✪ *XADON AI • ANTI-DELETE* ✪

🟢 Status: ${settings.status ? 'ON' : 'OFF'}
⚙️ Action: ${settings.action}

📌 Commands:
.antidelete on
.antidelete off
.antidelete action notify
.antidelete action silent

> XADON AI`);
        }

        const cmd = args[0].toLowerCase();

        if (cmd === 'on') {
            settings.status = true;
        }

        else if (cmd === 'off') {
            settings.status = false;
        }

        else if (cmd === 'action') {
            if (!args[1]) return reply('Use: notify or silent');
            const action = args[1].toLowerCase();

            if (!['notify', 'silent'].includes(action)) {
                return reply('❌ Only notify or silent allowed');
            }

            settings.action = action;
        }

        data[chatId] = settings;
        saveData(data);

        return reply(`✅ Anti-Delete updated\n\n🟢 Status: ${settings.status ? 'ON' : 'OFF'}\n⚙️ Action: ${settings.action}\n> XADON AI`);
    }
};