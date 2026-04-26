const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

module.exports = {
    command: "deobf",
    alias: ["unobf", "unlockcode"],
    category: "musteqeem",
    owner: true,

    execute: async (sock, m, { args, reply }) => {

        try {

            let file = args.join(" ");

            if (!file) {
                return reply(`
🔓 XADON AI DEOBF TOOL

Usage:
.deobf file.js

⚙️ Helps recover readable code
                `);
            }

            if (!fs.existsSync(file)) {
                return reply("❌ File not found.");
            }

            const backup = file + ".deobf.bak";

            if (!fs.existsSync(backup)) {
                fs.copyFileSync(file, backup);
            }

            await reply(`
╔〘 🔓 XADON AI DEOBF 〙╗
┃ ⚙️ Status: Analyzing file...
┃ 🧠 Mode: SAFE RECOVERY
╚═══════════════════════╝
            `);

            // STEP 1: Beautify using npx prettier (safe)
            const cmd = `npx prettier --write "${file}"`;

            exec(cmd, (err) => {

                if (err) {
                    return reply("❌ Error: " + err.message);
                }

                return reply(`
╔〘 🔓 DEOBF COMPLETE 〙╗
┃ ✅ File Beautified
┃ 📁 Backup: ${backup}
┃ 🧠 Readability Restored
╚═══════════════════════╝
                `);
            });

        } catch (err) {
            reply("❌ DEOBF ERROR: " + err.message);
        }
    }
};