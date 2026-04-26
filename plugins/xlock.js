const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

module.exports = {
    command: "xlock",
    alias: ["lock", "secure"],
    category: "musteqeem",
    owner: true,

    execute: async (sock, m, { args, reply }) => {

        try {

            let file = args.join(" ");

            if (!file) {
                return reply(`
🔐 XADON AI XLOCK ENGINE

Usage:
.xlock file.js
.xlock path/to/file.js

⚡ Ultra Security Obfuscation System
                `);
            }

            if (!fs.existsSync(file)) {
                return reply("❌ File not found.");
            }

            // Backup system
            const backup = file + ".backup";
            if (!fs.existsSync(backup)) {
                fs.copyFileSync(file, backup);
            }

            await reply(`
╔〘 🔐 XADON AI XLOCK 〙╗
┃ ⚙️ Status: Locking file...
┃ 🛡 Mode: ULTRA SECURITY
╚═══════════════════════╝
            `);

            // HARDCORE OBF SETTINGS
            const config = {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 1,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 0.6,
                stringArray: true,
                stringArrayEncoding: ["rc4"],
                stringArrayThreshold: 1,
                rotateStringArray: true,
                selfDefending: true,
                debugProtection: true,
                debugProtectionInterval: true,
                disableConsoleOutput: true,
                transformObjectKeys: true,
                unicodeEscapeSequence: true,
                splitStrings: true,
                splitStringsChunkLength: 3,
                numbersToExpressions: true,
                simplify: true
            };

            // Write temp config file
            const tempConfig = file + ".xlock.json";
            fs.writeFileSync(tempConfig, JSON.stringify(config, null, 2));

            const cmd = `npx javascript-obfuscator "${file}" --output "${file}" --config "${tempConfig}"`;

            exec(cmd, (err) => {

                fs.unlinkSync(tempConfig); // cleanup

                if (err) {
                    return reply("❌ Error: " + err.message);
                }

                return reply(`
╔〘 🔐 XLOCK COMPLETE 〙╗
┃ ✅ File Locked Successfully
┃ 🔥 Mode: ULTRA SECURITY
┃ 📁 Backup: ${backup}
╚═══════════════════════╝
                `);
            });

        } catch (err) {
            reply("❌ XLOCK ERROR: " + err.message);
        }
    }
};