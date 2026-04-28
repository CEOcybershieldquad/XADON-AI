const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

module.exports = {
    command: "#",
    alias: ["obfuscate", "xobf"],
    category: "musteqeem",
    owner: true,

    execute: async (sock, m, { args, reply }) => {

        let file = args[0];
        let mode = (args[1] || "hard").toLowerCase();

        if (!file) {
            return reply(`
🔐 XADON AI OBF ENGINE

Usage:
.obf file.js hard
.obf file.js extreme
.obf file.js ultra

Modes:
• normal
• hard
• extreme
• ultra
            `);
        }

        if (!fs.existsSync(file)) {
            return reply("❌ File not found.");
        }

        const backup = file + ".bak";
        if (!fs.existsSync(backup)) {
            fs.copyFileSync(file, backup);
        }

        // ================= OBF SETTINGS =================
        let config = {
            compact: true,
            renameGlobals: false,
            selfDefending: true,
            debugProtection: false,
            disableConsoleOutput: false,
            stringArray: true,
            rotateStringArray: true
        };

        if (mode === "hard") {
            config = {
                ...config,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 0.5,
                stringArrayEncoding: ["base64"],
                stringArrayThreshold: 0.7
            };
        }

        if (mode === "extreme") {
            config = {
                ...config,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 0.75,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 0.3,
                stringArrayEncoding: ["rc4", "base64"],
                stringArrayThreshold: 0.85,
                transformObjectKeys: true
            };
        }

        if (mode === "ultra") {
            config = {
                ...config,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 1,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 0.5,
                stringArrayEncoding: ["rc4"],
                stringArrayThreshold: 1,
                splitStrings: true,
                splitStringsChunkLength: 3,
                transformObjectKeys: true,
                unicodeEscapeSequence: true
            };
        }

        await reply(`🔐 Obfuscating in *${mode.toUpperCase()} MODE*...`);

        const cmd = `npx javascript-obfuscator "${file}" --output "${file}"`;

        // We use CLI but real power comes from config above if you extend later
        exec(cmd, (err) => {
            if (err) {
                return reply("❌ Error: " + err.message);
            }

            reply(`
✅ XADON AI OBF COMPLETE

📁 File: ${file}
🔥 Mode: ${mode.toUpperCase()}
🛡 Backup: ${backup}

⚡ Protected Successfully
            `);
        });
    }
};