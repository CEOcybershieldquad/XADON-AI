const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'database', 'antilink.json');

// Load DB
function loadDB() {
    if (!fs.existsSync(DB_PATH)) return {};
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

// Save DB
function saveDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Link detection
function hasLink(text) {
    const regex = /(https?:\/\/|www\.|chat\.whatsapp\.com|wa\.me|t\.me\/|discord\.gg|discord\.com|bit\.ly|tinyurl\.com|youtu\.be|instagram\.com|facebook\.com|twitter\.com)/i;
    return regex.test(text);
}

module.exports = {
    command: 'antilinkx',
    alias: ['al'],
    category: 'admin',
    description: 'Anti-Link system',

    execute: async (sock, m, { args, reply }) => {

        if (!m.isGroup) return reply('⚉ Group only');

        const db = loadDB();
        const group = m.chat;

        if (!db[group]) {
            db[group] = {
                enabled: false,
                action: 'delete',
                warnLimit: 3,
                warns: {}
            };
        }

        const cmd = args[0]?.toLowerCase();

        if (!cmd) {
            const status = db[group].enabled ? "🟢 ON" : "🔴 OFF";
            return reply(
                `✪ *XADON AI • ANTI-LINK*\n\n` +
                `⚉ Status: ${status}\n` +
                `⚉ Action: ${db[group].action}\n` +
                `⚉ Limit: ${db[group].warnLimit}\n\n` +
                `• .antilink on/off\n` +
                `• .antilink action delete|warn|kick\n` +
                `• .antilink limit 3`
            );
        }

        if (cmd === 'on') {
            db[group].enabled = true;
            saveDB(db);
            return reply('✅ AntiLink Enabled');
        }

        if (cmd === 'off') {
            db[group].enabled = false;
            saveDB(db);
            return reply('❌ AntiLink Disabled');
        }

        if (cmd === 'action') {
            const action = args[1];
            if (!['delete','warn','kick'].includes(action))
                return reply('⚠️ Invalid action');

            db[group].action = action;
            saveDB(db);
            return reply(`✅ Action → ${action}`);
        }

        if (cmd === 'limit') {
            const num = parseInt(args[1]);
            if (isNaN(num)) return reply('⚠️ Invalid number');

            db[group].warnLimit = num;
            saveDB(db);
            return reply(`✅ Limit → ${num}`);
        }
    }
};

// EXPORT CORE LOGIC ONLY
module.exports.handleAntiLink = async function(sock, m, { isEdited = false } = {}) {

    const db = loadDB();
    const group = m.chat;

    if (!m.isGroup || !db[group]?.enabled) return;
    if (!hasLink(m.text || "")) return;

    const meta = await sock.groupMetadata(group);
    const sender = m.sender;

    const isAdmin = meta.participants.some(p =>
        p.id === sender && p.admin
    );

    if (isAdmin) return;

    await sock.sendMessage(group, { delete: m.key });

    const action = db[group].action;
    db[group].warns[sender] = db[group].warns[sender] || 0;

    if (action === 'warn') {
        db[group].warns[sender]++;

        if (db[group].warns[sender] >= db[group].warnLimit) {
            await sock.groupParticipantsUpdate(group, [sender], 'remove');
            db[group].warns[sender] = 0;
        }
    }

    if (action === 'kick') {
        await sock.groupParticipantsUpdate(group, [sender], 'remove');
    }

    saveDB(db);
};