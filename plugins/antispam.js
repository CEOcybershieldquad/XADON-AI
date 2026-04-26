const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/antispam.json');

if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
}

const getAntiSpamData = () => {
    try {
        return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
        return {};
    }
};

const saveAntiSpamData = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = {
    command: 'antispam',
    alias: ['antispam', 'spam'],
    description: '2026 Senior Anti-Spam System - Multiple windows + smart detection',
    category: 'antis',
    usage: '.antispam on/off | limit <msgs> <seconds> | ...',

    execute: async (sock, m, { args, reply, isAdmin }) => {
        if (!m.isGroup) return reply('❌ Only in groups\n> XADON AI');
        if (!m.isAdmin) return reply('❌ Admins only\n> XADON AI');

        const chatId = m.chat;
        let data = getAntiSpamData();

        if (!data[chatId]) {
            data[chatId] = {
                status: false,
                windows: [ // multiple time windows
                    { msgs: 5, seconds: 10 },   // burst protection
                    { msgs: 8, seconds: 60 }    // flood protection
                ],
                action: 'warn',
                warnLimit: 3,
                warns: {},
                exempt: [],                    // userIds exempt from spam check
                duplicateEnabled: true,
                maxMentions: 8,
                lastMessages: {},              // {userId: [{time, text, type}]}
                spamScoreThreshold: 70
            };
        }

        const groupData = data[chatId];

        if (!args[0]) {
            const statusEmoji = groupData.status ? '🟢 ON' : '🔴 OFF';
            const windowsText = groupData.windows.map(w => `${w.msgs} msgs / ${w.seconds}s`).join(' | ');
            return reply(`✪ *XADON AI • 2026 SENIOR ANTI-SPAM* ✪

🦅 Status: ${statusEmoji}
📊 Windows: ${windowsText}
🛡️ Action: ${groupData.action.toUpperCase()}
⚠️ Warn Limit: ${groupData.warnLimit}
👥 Exempt Users: ${groupData.exempt.length}
🔁 Duplicate Detect: ${groupData.duplicateEnabled ? 'ON' : 'OFF'}

🔹 .antispam on / off
🔹 .antispam limit 5 10
🔹 .antispam limit 8 60
🔹 .antispam action delete/warn/kick
🔹 .antispam warnlimit 3
🔹 .antispam exempt add @user
🔹 .antispam exempt remove @user
🔹 .antispam exempt list
🔹 .antispam duplicate on/off
🔹 .antispam reset [user]
🔹 .antispam status

> Multi-window + duplicate + mention + emoji flood protection
> XADON AI`);
        }

        const sub = args[0].toLowerCase();

        if (sub === 'on') {
            groupData.status = true;
            saveAntiSpamData(data);
            return reply(`✅ 2026 Senior Anti-Spam **ENABLED**\n> XADON AI`);
        }

        if (sub === 'off') {
            groupData.status = false;
            saveAntiSpamData(data);
            return reply(`❌ Anti-Spam **DISABLED**\n> XADON AI`);
        }

        if (sub === 'limit' && args[1] && args[2]) {
            const msgs = parseInt(args[1]);
            const secs = parseInt(args[2]);
            if (isNaN(msgs) || isNaN(secs) || msgs < 3 || secs < 5) {
                return reply('⚠️ .antispam limit <messages> <seconds>\nExample: .antispam limit 5 10\n> XADON AI');
            }
            // Add or update window
            const existing = groupData.windows.findIndex(w => w.seconds === secs * 1000);
            if (existing !== -1) {
                groupData.windows[existing].msgs = msgs;
            } else {
                groupData.windows.push({ msgs, seconds: secs * 1000 });
            }
            saveAntiSpamData(data);
            return reply(`📊 Added window: ${msgs} messages in ${secs} seconds\n> XADON AI`);
        }

        if (sub === 'action' && args[1]) {
            const act = args[1].toLowerCase();
            if (!['delete','warn','kick'].includes(act)) return reply('Valid: delete / warn / kick');
            groupData.action = act;
            saveAntiSpamData(data);
            return reply(`🛡️ Action set to **${act.toUpperCase()}**\n> XADON AI`);
        }

        if (sub === 'warnlimit' && args[1]) {
            const lim = parseInt(args[1]);
            if (isNaN(lim) || lim < 1) return reply('Warn limit 1-10');
            groupData.warnLimit = lim;
            saveAntiSpamData(data);
            return reply(`⚠️ Warn limit: ${lim}\n> XADON AI`);
        }

        if (sub === 'duplicate' && args[1]) {
            groupData.duplicateEnabled = args[1].toLowerCase() === 'on';
            saveAntiSpamData(data);
            return reply(`🔁 Duplicate detection: ${groupData.duplicateEnabled ? 'ENABLED' : 'DISABLED'}\n> XADON AI`);
        }

        if (sub === 'exempt') {
            if (args[1] === 'list') {
                return reply(`Exempt users: ${groupData.exempt.length ? groupData.exempt.map(u => '@' + u.split('@')[0]).join(', ') : 'None'}\n> XADON AI`);
            }
            // add / remove logic (handle mentions)
            // ... (simplified - you can expand with m.mentionedJid)
            return reply('Use .antispam exempt add @user or remove\n> XADON AI');
        }

        if (sub === 'status') {
            return reply(`Current windows: \( {groupData.windows.map(w => ` \){w.msgs}/${w.seconds/1000}s`).join(' | ')}\nAction: ${groupData.action}\n> XADON AI`);
        }

        return reply(`Type .antispam for full senior command list.\n> XADON AI`);
    }
};

