const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/groupEvents.json');

// ✅ FIXED FILE CHECK
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
}

// ===== DEFAULT MESSAGES =====
const defaultWelcome = `👋 Welcome @user

🎉 You joined *$groupname*
📊 Members: $members

🕒 Joined: $time
📅 Date: $date

💬 Enjoy your stay!`;

const defaultGoodbye = `👋 Goodbye @user

❌ Left *$groupname*
📊 Members now: $members

🕒 Time: $time`;

const defaultPromote = `🎖️ @user has been promoted to admin in *$groupname*`;
const defaultDemote = `⚠️ @user has been demoted in *$groupname*`;

module.exports = {
    command: 'events',
    alias: ['gcevents', 'gevents'],
    description: 'Advanced Group Events System',
    category: 'group',

    execute: async (sock, m, { reply }) => {
        try {
            const args = m.body.trim().split(/\s+/);
            const cmd = args[1]?.toLowerCase();

            // ✅ SAFE LOAD
            let db = {};
            try {
                db = JSON.parse(fs.readFileSync(dbPath));
            } catch {
                db = {};
            }

            if (!db[m.chat]) {
                db[m.chat] = {
                    enabled: false,
                    welcome: defaultWelcome,
                    goodbye: defaultGoodbye,
                    promote: defaultPromote,
                    demote: defaultDemote
                };
            }

            // ===== FULL MENU =====
            if (!cmd) {
                return reply(`
╔═══『 🌟 XADON EVENTS SYSTEM 』═══╗

📌 *MAIN CONTROLS*
• .events on/off
• .events status
• .events reset

🛠️ *CUSTOMIZATION*
• .events setwelcome <text>
• .events setgoodbye <text>
• .events setpromote <text>
• .events setdemote <text>

👁️ *VIEW MESSAGES*
• .events getwelcome
• .events getgoodbye
• .events getpromote
• .events getdemote

🧪 *TEST SYSTEM*
• .events testwelcome
• .events testgoodbye
• .events testpromote
• .events testdemote

⚙️ *EXTRA OPTIONS*
• .events preview
• .events variables
• .events help

♻️ *RESET OPTIONS*
• .events deletewelcome
• .events deletegoodbye
• .events deletepromote
• .events deletedemote

━━━━━━━━━━━━━━━━━━━
💡 Tip: Use *.events variables*
to see all placeholders (25+)

╚═══════════════════╝
`);
            }

            // ===== ENABLE / DISABLE =====
            if (cmd === 'on') db[m.chat].enabled = true;
            else if (cmd === 'off') db[m.chat].enabled = false;

            // ===== STATUS =====
            else if (cmd === 'status') {
                return reply(`📊 *STATUS:* ${db[m.chat].enabled ? '✅ ENABLED' : '❌ DISABLED'}`);
            }

            // ===== RESET =====
            else if (cmd === 'reset') {
                db[m.chat] = {
                    enabled: false,
                    welcome: defaultWelcome,
                    goodbye: defaultGoodbye,
                    promote: defaultPromote,
                    demote: defaultDemote
                };
                fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
                return reply('♻️ *Events reset to default!*');
            }

            // ===== VARIABLES =====
            else if (cmd === 'variables') {
                return reply(`
📌 *AVAILABLE VARIABLES (25+)*

👤 USER:
@user, $username, $jid, $bio, $status

👥 GROUP:
$groupname, $members, $desc, $admin, $owner

🕒 TIME:
$time, $date, $day, $year

🤖 BOT:
$bot, $prefix

🎮 SYSTEM:
$xp, $level, $rank, $random

🎴 SPECIAL:
$tgcard

✨ Use them in welcome/goodbye messages
`);
            }

            // ===== SETTERS =====
            else if (cmd === 'setwelcome') {
                db[m.chat].welcome = args.slice(2).join(' ');
                return reply('✅ Welcome message updated!');
            }

            else if (cmd === 'setgoodbye') {
                db[m.chat].goodbye = args.slice(2).join(' ');
                return reply('✅ Goodbye message updated!');
            }

            else if (cmd === 'setpromote') {
                db[m.chat].promote = args.slice(2).join(' ');
                return reply('✅ Promote message updated!');
            }

            else if (cmd === 'setdemote') {
                db[m.chat].demote = args.slice(2).join(' ');
                return reply('✅ Demote message updated!');
            }

            // ===== GETTERS =====
            else if (cmd === 'getwelcome') return reply(db[m.chat].welcome);
            else if (cmd === 'getgoodbye') return reply(db[m.chat].goodbye);
            else if (cmd === 'getpromote') return reply(db[m.chat].promote);
            else if (cmd === 'getdemote') return reply(db[m.chat].demote);

            // ===== DELETE =====
            else if (cmd === 'deletewelcome') {
                db[m.chat].welcome = defaultWelcome;
                return reply('♻️ Welcome reset!');
            }

            else if (cmd === 'deletegoodbye') {
                db[m.chat].goodbye = defaultGoodbye;
                return reply('♻️ Goodbye reset!');
            }

            else if (cmd === 'deletepromote') {
                db[m.chat].promote = defaultPromote;
                return reply('♻️ Promote reset!');
            }

            else if (cmd === 'deletedemote') {
                db[m.chat].demote = defaultDemote;
                return reply('♻️ Demote reset!');
            }

            // ===== TEST =====
            else if (cmd === 'testwelcome') return reply(db[m.chat].welcome.replace('@user', '@test'));
            else if (cmd === 'testgoodbye') return reply(db[m.chat].goodbye.replace('@user', '@test'));
            else if (cmd === 'testpromote') return reply(db[m.chat].promote.replace('@user', '@test'));
            else if (cmd === 'testdemote') return reply(db[m.chat].demote.replace('@user', '@test'));

            // ===== PREVIEW =====
            else if (cmd === 'preview') {
                return reply(`
👁️ *PREVIEW*

WELCOME:
${db[m.chat].welcome}

GOODBYE:
${db[m.chat].goodbye}

PROMOTE:
${db[m.chat].promote}

DEMOTE:
${db[m.chat].demote}
`);
            }

            // ===== HELP =====
            else if (cmd === 'help') {
                return reply('📘 Use .events to open full menu');
            }

            else {
                return reply('❌ Invalid command');
            }

            // ✅ SAVE FIXED
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        } catch (e) {
            console.error(e);
            reply('❌ Error in Events System');
        }
    }
};