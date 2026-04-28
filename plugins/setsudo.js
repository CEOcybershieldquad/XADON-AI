const fs = require('fs');
const path = require('path');

const SUDO_FILE = path.join(process.cwd(), 'database', 'sudo.json');

// Load sudo list
function getSudoList() {
    try {
        if (!fs.existsSync(SUDO_FILE)) {
            fs.writeFileSync(SUDO_FILE, '[]');
            return [];
        }
        return JSON.parse(fs.readFileSync(SUDO_FILE, 'utf8'));
    } catch {
        return [];
    }
}

// Save sudo list
function saveSudoList(list) {
    fs.mkdirSync(path.dirname(SUDO_FILE), { recursive: true });
    fs.writeFileSync(SUDO_FILE, JSON.stringify(list, null, 2));
}

module.exports = {
    command: 'setsudo',
    alias: ['sudo', 'addsudo'],
    description: 'Manage sudo users for private mode',
    category: 'owner',
    owner: true,
    usage: '.setsudo <add/del/list> <@user/number>',

    execute: async (sock, m, { args, reply, isCreator }) => {
        if (!isCreator) {
            return reply(`❌ Owner only command\n\n> ֎`);
        }

        const action = args[0]?.toLowerCase();
        let target = args[1];

        let sudoList = getSudoList();

        await sock.sendMessage(m.chat, { react: { text: '⚡', key: m.key } });

        // LIST SUDO USERS
        if (!action || action === 'list') {
            if (sudoList.length === 0) {
                return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • SUDO LIST*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📋 No sudo users set

💡 Add:.setsudo add @user
💡 Add by number:.setsudo add 2348012345678

> ֎`);
            }

            let list = sudoList.map((num, i) => `${i + 1}. @${num.split('@')[0]}`).join('\n');

            return sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • SUDO LIST*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

👑 Sudo Users: ${sudoList.length}

${list}

💡 Remove:.setsudo del @user

> ֎`,
                mentions: sudoList
            }, { quoted: m });
        }

        // ADD SUDO USER
        if (action === 'add') {
            if (!target) {
                if (m.quoted) {
                    target = m.quoted.sender;
                } else if (m.mentionedJid?.length > 0) {
                    target = m.mentionedJid[0];
                } else {
                    await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return reply(`❌ Tag user or reply to message\n\nExample:.setsudo add @user\nExample:.setsudo add 2348012345678\n\n> ֎`);
                }
            }

            // Clean number format
            if (!target.includes('@')) {
                target = target.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            }

            if (sudoList.includes(target)) {
                await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return reply(`❌ @${target.split('@')[0]} is already sudo\n\n> ֎`, { mentions: [target] });
            }

            sudoList.push(target);
            saveSudoList(sudoList);

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
            return sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • SUDO ADDED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ @${target.split('@')[0]} added to sudo

👑 Can now use bot in private mode
📊 Total sudo users: ${sudoList.length}

> ֎`,
                mentions: [target]
            }, { quoted: m });
        }

        // DELETE SUDO USER
        if (action === 'del' || action === 'remove') {
            if (!target) {
                if (m.quoted) {
                    target = m.quoted.sender;
                } else if (m.mentionedJid?.length > 0) {
                    target = m.mentionedJid[0];
                } else {
                    await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return reply(`❌ Tag user or reply to message\n\nExample:.setsudo del @user\n\n> ֎`);
                }
            }

            if (!target.includes('@')) {
                target = target.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            }

            if (!sudoList.includes(target)) {
                await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return reply(`❌ @${target.split('@')[0]} is not sudo\n\n> ֎`, { mentions: [target] });
            }

            sudoList = sudoList.filter(u => u!== target);
            saveSudoList(sudoList);

            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
            return sock.sendMessage(m.chat, {
                text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • SUDO REMOVED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🗑️ @${target.split('@')[0]} removed from sudo

📊 Total sudo users: ${sudoList.length}

> ֎`,
                mentions: [target]
            }, { quoted: m });
        }

        await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        return reply(`❌ Invalid action\n\nUse: add | del | list\n\n> ֎`);
    }
};