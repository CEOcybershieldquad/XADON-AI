const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/antilink.json');

// Ensure DB
if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
}

// Load & Save
const loadDB = () => {
    try { return JSON.parse(fs.readFileSync(dbPath)); }
    catch { return {}; }
};

const saveDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Detect links
const hasLink = (text) => /(https?:\/\/|www\.|chat\.whatsapp\.com|wa\.me)/i.test(text);

// Extract domains
const extractDomains = (text) => {
    const matches = text.match(/(?:https?:\/\/)?(?:www\.)?([a-z0-9.-]+\.[a-z]{2,})/gi);
    if (!matches) return [];
    return matches.map(d =>
        d.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase()
    );
};

// Extract URLs
const extractUrls = (text) => {
    const matches = text.match(/https?:\/\/[^\s]+/gi);
    return matches ? matches.map(u => u.toLowerCase()) : [];
};

module.exports = {
    command: 'antilink',
    alias: ['al'],
    description: 'Advanced Anti-Link system',
    category: 'antis',

    execute: async (sock, m, { args, reply }) => {

        if (!m.isGroup) return reply('❌ Group only\n> XADON AI');

        const db = loadDB();
        const chat = m.chat;

        if (!db[chat]) {
            db[chat] = {
                enabled: false,
                action: 'warn',
                warnLimit: 3,
                warns: {},
                whitelist: [],
                permit: [],
                bypassAdmin: true,
                inviteOnly: false,
                cooldown: 5,
                lastWarn: {}
            };
        }

        const cfg = db[chat];

        // SHOW MENU
        if (!args[0]) {
            return reply(`✪ *XADON AI • ANTILINK v1* ✪

🟢 Status: ${cfg.enabled ? 'ON' : 'OFF'}
⚙️ Action: ${cfg.action.toUpperCase()}
⚠️ Warn Limit: ${cfg.warnLimit}
🛡 Admin Bypass: ${cfg.bypassAdmin ? 'ON' : 'OFF'}
🔗 Invite Only: ${cfg.inviteOnly ? 'ON' : 'OFF'}
⏱ Cooldown: ${cfg.cooldown}s

📋 Whitelist:
${cfg.whitelist.join(', ') || 'None'}

🔓 Permit URLs:
${cfg.permit.join('\n') || 'None'}

📌 Commands:
• .antilink on/off
• .antilink action warn/delete/kick
• .antilink limit 3
• .antilink bypass on/off
• .antilink inviteonly on/off
• .antilink cooldown 5
• .antilink add <domain>
• .antilink remove <domain>
• .antilink permit <url>
• .antilink unpermit <url>

> XADON AI`);
        }

        const sub = args[0].toLowerCase();

        if (sub === 'on') { cfg.enabled = true; saveDB(db); return reply('✅ Enabled'); }
        if (sub === 'off') { cfg.enabled = false; saveDB(db); return reply('❌ Disabled'); }

        if (sub === 'action') {
            if (!['warn','delete','kick'].includes(args[1])) return reply('⚠️ warn/delete/kick');
            cfg.action = args[1]; saveDB(db);
            return reply(`⚙️ Action → ${args[1]}`);
        }

        if (sub === 'limit') {
            const n = parseInt(args[1]);
            if (isNaN(n) || n < 1 || n > 10) return reply('⚠️ 1-10 only');
            cfg.warnLimit = n; saveDB(db);
            return reply(`⚠️ Limit → ${n}`);
        }

        if (sub === 'bypass') {
            cfg.bypassAdmin = args[1] === 'on';
            saveDB(db);
            return reply(`🛡 Admin bypass ${cfg.bypassAdmin ? 'ON' : 'OFF'}`);
        }

        if (sub === 'inviteonly') {
            cfg.inviteOnly = args[1] === 'on';
            saveDB(db);
            return reply(`🔗 Invite-only ${cfg.inviteOnly ? 'ON' : 'OFF'}`);
        }

        if (sub === 'cooldown') {
            const sec = parseInt(args[1]);
            if (isNaN(sec)) return reply('⚠️ number only');
            cfg.cooldown = sec;
            saveDB(db);
            return reply(`⏱ Cooldown → ${sec}s`);
        }

        if (sub === 'add') {
            let d = args[1];
            if (!d) return reply('❌ domain?');
            d = d.replace(/^https?:\/\//,'').replace(/^www\./,'');
            if (!cfg.whitelist.includes(d)) cfg.whitelist.push(d);
            saveDB(db);
            return reply(`✅ ${d} added`);
        }

        if (sub === 'remove') {
            let d = args[1];
            if (!d) return reply('❌ domain?');
            d = d.replace(/^https?:\/\//,'').replace(/^www\./,'');
            cfg.whitelist = cfg.whitelist.filter(x => x !== d);
            saveDB(db);
            return reply(`🗑 removed ${d}`);
        }

        if (sub === 'permit') {
            const url = args[1];
            if (!url?.startsWith('http')) return reply('❌ full url only');
            if (!cfg.permit.includes(url)) cfg.permit.push(url);
            saveDB(db);
            return reply(`🔓 permitted`);
        }

        if (sub === 'unpermit') {
            const url = args[1];
            cfg.permit = cfg.permit.filter(u => u !== url);
            saveDB(db);
            return reply(`🗑 removed permit`);
        }

        return reply('❌ Invalid command');
    }
};

// ================= HANDLER =================
module.exports.handleAntiLink = async (sock, m) => {
    try {
        if (!m.isGroup || m.key?.fromMe) return;

        const db = loadDB();
        const chat = m.chat;
        const cfg = db[chat];

        if (!cfg || !cfg.enabled) return;

        const text = m.text || m.body || '';
        if (!text || !hasLink(text)) return;

        // Invite-only mode
        if (cfg.inviteOnly && !/chat\.whatsapp\.com/i.test(text)) return;

        const urls = extractUrls(text);
        const domains = extractDomains(text);

        // Permit check
        if (urls.some(u => cfg.permit.some(p => u.startsWith(p)))) return;

        // Whitelist
        if (domains.some(d => cfg.whitelist.includes(d))) return;

        const meta = await sock.groupMetadata(chat).catch(() => null);
        if (!meta) return;

        const sender = m.sender;

        // Admin bypass
        if (cfg.bypassAdmin) {
            const admins = meta.participants
                .filter(p => p.admin)
                .map(p => p.id);
            if (admins.includes(sender)) return;
        }

        const now = Date.now();
        if (cfg.lastWarn[sender] && now - cfg.lastWarn[sender] < cfg.cooldown * 1000) return;
        cfg.lastWarn[sender] = now;

        await sock.sendMessage(chat, { delete: m.key }).catch(()=>{});

        if (!cfg.warns[sender]) cfg.warns[sender] = 0;
        cfg.warns[sender]++;

        const count = cfg.warns[sender];

        if (cfg.action === 'warn') {
            await sock.sendMessage(chat, {
                text: `⚠️ @${sender.split('@')[0]} Link detected!
Warn: ${count}/${cfg.warnLimit}`,
                mentions: [sender]
            });

            if (count >= cfg.warnLimit) {
                await sock.groupParticipantsUpdate(chat, [sender], 'remove').catch(()=>{});
            }
        }

        if (cfg.action === 'kick') {
            await sock.sendMessage(chat, {
                text: `🚫 @${sender.split('@')[0]} removed`,
                mentions: [sender]
            });
            await sock.groupParticipantsUpdate(chat, [sender], 'remove').catch(()=>{});
        }

        saveDB(db);

    } catch (e) {
        console.error('AntiLink Error:', e);
    }
};