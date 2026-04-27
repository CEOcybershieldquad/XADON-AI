const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = {
    command: 'obf',
    alias: ['obfuscate', 'xobf'],
    category: 'musteqeem',

    reactions: {
        start: '🔐',
        success: '⚡'
    },

    execute: async (sock, m, { args, reply }) => {

        try {

            let statusMsg;

            const editStatus = async (text) => {
                if (!statusMsg) {
                    statusMsg = await sock.sendMessage(m.chat, { text });
                } else {
                    await sock.sendMessage(m.chat, {
                        text,
                        edit: statusMsg.key
                    });
                }
            };

            const bar = (p) => {
                const total = 10;
                const fill = Math.round((p / 100) * total);
                return '█'.repeat(fill) + '░'.repeat(total - fill);
            };

            // ================= INPUT (REPLY OR ARG) =================
            let filePath = args.join(' ');

            // If reply to document/file
            const quoted = m.quoted || m.message?.extendedTextMessage?.contextInfo?.quotedMessage;

            if (!filePath && quoted) {
                return reply("❌ Please provide file path or reply with file path text.");
            }

            if (!filePath) return reply("📌 Usage: .obf path/to/file.js");

            filePath = filePath.trim();

            if (!fs.existsSync(filePath)) {
                return reply("❌ File not found.");
            }

            // ================= START PROCESS =================
            await editStatus(`
╔〘 🔐 XADON AI OBFUSCATOR 〙╗
┃ ⚙️ Status: Preparing...
┃ ${bar(20)} 20%
╚═══════════════════════╝
            `);

            // Backup
            const backup = filePath + '.bak';
            if (!fs.existsSync(backup)) {
                fs.copyFileSync(filePath, backup);
            }

            await editStatus(`
╔〘 🔐 XADON AI OBFUSCATOR 〙╗
┃ 🛠 Status: Obfuscating...
┃ ${bar(60)} 60%
╚═══════════════════════╝
            `);

            // Run obfuscator
            const cmd = `npx javascript-obfuscator "${filePath}" --output "${filePath}"`;

            exec(cmd, async (err) => {

                if (err) {
                    return await editStatus(`
╔〘 🔐 XADON AI OBFUSCATOR 〙╗
┃ ❌ FAILED
┃ ${err.message}
╚═══════════════════════╝
                    `);
                }

                await editStatus(`
╔〘 🔐 XADON AI OBFUSCATOR 〙╗
┃ ✅ SUCCESS
┃ ${bar(100)} 100%
┃ 📁 File secured
╚═══════════════════════╝
                `);
            });

        } catch (err) {
            reply("❌ Error: " + err.message);
        }
    }
};