const fs = require('fs');
const path = require('path');

// ====================== AUTO REPLY DATABASE ======================
const arPath = path.join(__dirname, '../database/autoreply.json');

if (!fs.existsSync(arPath)) {
    fs.writeFileSync(arPath, JSON.stringify({}, null, 2));
}

const getAR = () => {
    try {
        return JSON.parse(fs.readFileSync(arPath, 'utf8'));
    } catch {
        return {};
    }
};

const saveAR = (data) => {
    fs.writeFileSync(arPath, JSON.stringify(data, null, 2));
};

// ====================== COMMAND ======================
module.exports = {
    command: 'autoreply',
    alias: ['ar'],
    category: 'tools',

    execute: async (sock, m, { args, reply }) => {

        if (!m.isGroup) return reply('❌ Group only');

        let db = getAR();
        const chat = m.chat;

        // ✅ MATCH HANDLER STRUCTURE
        if (!db[chat]) {
            db[chat] = {
                enabled: true,
                replies: {}
            };
        }

        const cfg = db[chat];
        const text = args.join(' ');

        // ================= MENU =================
        if (!text) {
            return reply(
`🤖 *AUTO REPLY*

Status: ${cfg.enabled ? 'ON' : 'OFF'}

Commands:
.on / .off
.hi for hello
.hi | hello
.list
.del hi`
            );
        }

        const sub = args[0]?.toLowerCase();

        // ================= ON =================
        if (sub === 'on') {
            cfg.enabled = true;
            saveAR(db);
            return reply('✅ AutoReply ON');
        }

        // ================= OFF =================
        if (sub === 'off') {
            cfg.enabled = false;
            saveAR(db);
            return reply('❌ AutoReply OFF');
        }

        // ================= LIST =================
        if (sub === 'list') {
            const list = Object.entries(cfg.replies)
                .map(([k, v]) => `• ${k} → ${v}`)
                .join('\n') || 'No replies set';

            return reply(`📋 *Auto Replies*\n\n${list}`);
        }

        // ================= DELETE =================
        if (sub === 'del') {
            const key = args[1]?.toLowerCase();

            if (!key) return reply('❌ provide keyword');

            if (!cfg.replies[key]) return reply('❌ Not found');

            delete cfg.replies[key];
            saveAR(db);

            return reply(`🗑 Removed "${key}"`);
        }

        // ================= ADD (FOR FORMAT) =================
        if (text.includes(' for ')) {
            const [trigger, response] = text.split(' for ');

            if (!trigger || !response) return reply('❌ invalid format');

            cfg.replies[trigger.toLowerCase().trim()] = response.trim();

            saveAR(db);

            return reply(`✅ "${trigger}" → "${response}"`);
        }

        // ================= ADD (| FORMAT) =================
        if (text.includes('|')) {
            const [trigger, response] = text.split('|').map(x => x.trim());

            if (!trigger || !response) return reply('❌ invalid format');

            cfg.replies[trigger.toLowerCase()] = response;

            saveAR(db);

            return reply(`✅ "${trigger}" → "${response}"`);
        }

        return reply('❌ Invalid format');
    }
};