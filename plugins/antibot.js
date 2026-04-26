const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/anibot.json');

if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
}

const getAniBotData = () => {
    try {
        return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
        return {};
    }
};

const saveAniBotData = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = {
    command: 'anibot',
    alias: ['anibot', 'strict', 'anistrict'],
    description: 'Enable/Configure AniBot Strict Mode (Senior Kord Level)',
    category: 'group',
    usage: '.anibot on/off | mode strict/normal | action kick',

    execute: async (sock, m, { args, reply, isAdmin }) => {
        if (!m.isGroup) return reply('❌ Only in groups\n> XADON AI');
        if (!m.isAdmin) return reply('❌ Admins only\n> XADON AI');

        const chatId = m.chat;
        let data = getAniBotData();

        if (!data[chatId]) {
            data[chatId] = {
                status: false,
                mode: 'strict',        // strict = zero tolerance
                action: 'kick',        // delete / warn / kick (strict defaults to kick)
                badwords: true,
                strictLinks: true,     // no whitelist in strict mode
                maxMentions: 5,
                duplicateStrict: true
            };
        }

        const groupData = data[chatId];

        if (!args[0]) {
            const statusEmoji = groupData.status ? '🟢 STRICT ENABLED' : '🔴 OFF';
            return reply(`✪ *XADON AI • ANIBOT STRICT MODE* ✪

🛡️ Status: ${statusEmoji}
⚔️ Mode: ${groupData.mode.toUpperCase()}
🛡️ Action: ${groupData.action.toUpperCase()}
🚫 Bad Words: ${groupData.badwords ? 'ON' : 'OFF'}
🔗 Strict Links: ${groupData.strictLinks ? 'ON (No Whitelist)' : 'OFF'}

🔹 .anibot on
🔹 .anibot off
🔹 .anibot mode strict/normal
🔹 .anibot action kick
🔹 .anibot badwords on/off

> Very Strict Senior Xadon Level Protection
> One violation = heavy punishment
> XADON AI`);
        }

        const sub = args[0].toLowerCase();

        if (sub === 'on') {
            groupData.status = true;
            saveAniBotData(data);
            return reply(`✅ **AniBot Strict Mode** ACTIVATED\nZero tolerance enabled.\n> XADON AI`);
        }

        if (sub === 'off') {
            groupData.status = false;
            saveAniBotData(data);
            return reply(`❌ AniBot Strict Mode **DISABLED**\n> XADON AI`);
        }

        if (sub === 'mode' && args[1]) {
            groupData.mode = args[1].toLowerCase() === 'strict' ? 'strict' : 'normal';
            saveAniBotData(data);
            return reply(`⚔️ AniBot mode set to **${groupData.mode.toUpperCase()}**\n> XADON AI`);
        }

        if (sub === 'action' && args[1]) {
            const act = args[1].toLowerCase();
            if (!['delete', 'warn', 'kick'].includes(act)) return reply('Valid: delete/warn/kick');
            groupData.action = act;
            saveAniBotData(data);
            return reply(`🛡️ Action set to **${act.toUpperCase()}**\n> XADON AI`);
        }

        if (sub === 'badwords' && args[1]) {
            groupData.badwords = args[1].toLowerCase() === 'on';
            saveAniBotData(data);
            return reply(`🚫 Bad words filter: ${groupData.badwords ? 'ENABLED' : 'DISABLED'}\n> XADON AI`);
        }

        return reply(`Use .anibot for full strict commands.\n> XADON AI`);
    }
};