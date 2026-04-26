const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/antitag.json');

if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
}

const getAntiTagData = () => {
    try {
        return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
        return {};
    }
};

const saveAntiTagData = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = {
    command: 'antitag',
    alias: ['antitag', 'antimention'],
    description: 'Advanced Anti-Tag System - Single | Mass | Status Mention',
    category: 'group',
    usage: '.antitag on/off | single on/off | mass on/off | status on/off | ...',

    execute: async (sock, m, { args, reply, isAdmin }) => {
        if (!m.isGroup) return reply('❌ This command works only in groups\n> XADON AI');
        if (!m.isAdmin) return reply('❌ Only group admins can manage Anti-Tag\n> XADON AI');

        const chatId = m.chat;
        let data = getAntiTagData();

        if (!data[chatId]) {
            data[chatId] = {
                status: false,
                single: true,      // single mention protection
                mass: true,        // mass mention (5+ or @all style)
                statusMention: true, // group status / "mention all" style
                maxMentions: 5,    // threshold for mass mention
                action: 'delete',  // delete / warn / kick
                warns: {},
                warnLimit: 3
            };
        }

        const groupData = data[chatId];

        if (!args[0]) {
            const statusEmoji = groupData.status ? '🟢 ENABLED' : '🔴 DISABLED';
            return reply(`✪ *XADON AI • ANTI-TAG SYSTEM* ✪

🛡️ Overall Status: ${statusEmoji}
🔹 Single Mention: ${groupData.single ? 'ON' : 'OFF'}
🔹 Mass Mention: ${groupData.mass ? 'ON' : 'OFF'}
🔹 Status/Group Mention: ${groupData.statusMention ? 'ON' : 'OFF'}
🛡️ Action: ${groupData.action.toUpperCase()}
⚠️ Warn Limit: ${groupData.warnLimit}
📊 Max Mentions: ${groupData.maxMentions}

🔹 .antitag on / off
🔹 .antitag single on/off
🔹 .antitag mass on/off
🔹 .antitag status on/off
🔹 .antitag action delete/warn/kick
🔹 .antitag max 5
🔹 .antitag warnlimit 3
🔹 .antitag reset @user
🔹 .antitag status
🔹 .antitag exempt add @user

> Choose any combination or enable all
> XADON AI`);
        }

        const subCmd = args[0].toLowerCase();

        if (subCmd === 'on') {
            groupData.status = true;
            saveAntiTagData(data);
            return reply(`✅ Anti-Tag System **ENABLED**\n> XADON AI`);
        }

        if (subCmd === 'off') {
            groupData.status = false;
            saveAntiTagData(data);
            return reply(`❌ Anti-Tag System **DISABLED**\n> XADON AI`);
        }

        if (subCmd === 'single' && args[1]) {
            groupData.single = args[1].toLowerCase() === 'on';
            saveAntiTagData(data);
            return reply(`🔹 Single Mention Protection: ${groupData.single ? 'ON' : 'OFF'}\n> XADON AI`);
        }

        if (subCmd === 'mass' && args[1]) {
            groupData.mass = args[1].toLowerCase() === 'on';
            saveAntiTagData(data);
            return reply(`🔹 Mass Mention Protection: ${groupData.mass ? 'ON' : 'OFF'}\n> XADON AI`);
        }

        if (subCmd === 'status' && args[1]) {
            groupData.statusMention = args[1].toLowerCase() === 'on';
            saveAntiTagData(data);
            return reply(`🔹 Status/Group Mention Protection: ${groupData.statusMention ? 'ON' : 'OFF'}\n> XADON AI`);
        }

        if (subCmd === 'action' && args[1]) {
            const action = args[1].toLowerCase();
            if (!['delete', 'warn', 'kick'].includes(action)) {
                return reply('⚠️ Valid actions: delete / warn / kick\n> XADON AI');
            }
            groupData.action = action;
            saveAntiTagData(data);
            return reply(`🛡️ Anti-Tag action set to **${action.toUpperCase()}**\n> XADON AI`);
        }

        if (subCmd === 'max' && args[1]) {
            const max = parseInt(args[1]);
            if (isNaN(max) || max < 2) return reply('⚠️ Max mentions must be 2 or higher\n> XADON AI');
            groupData.maxMentions = max;
            saveAntiTagData(data);
            return reply(`📊 Mass mention threshold set to **${max}**\n> XADON AI`);
        }

        if (subCmd === 'warnlimit' && args[1]) {
            const limit = parseInt(args[1]);
            if (isNaN(limit) || limit < 1 || limit > 10) return reply('⚠️ Warn limit: 1-10\n> XADON AI');
            groupData.warnLimit = limit;
            saveAntiTagData(data);
            return reply(`⚠️ Warn limit set to **${limit}**\n> XADON AI`);
        }

        if (subCmd === 'status') {
            return reply(`✪ Anti-Tag Status\nSingle: ${groupData.single ? 'ON' : 'OFF'}\nMass: ${groupData.mass ? 'ON' : 'OFF'}\nStatus Mention: ${groupData.statusMention ? 'ON' : 'OFF'}\nAction: ${groupData.action}\n> XADON AI`);
        }

        return reply(`Type .antitag to see all 10+ commands.\n> XADON AI`);
    }
};