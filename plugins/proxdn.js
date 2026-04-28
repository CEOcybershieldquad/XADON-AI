const fs = require("fs");
const path = require("path");
const JavaScriptObfuscator = require("javascript-obfuscator");

const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

function readFileSafe(file) {
    try {
        return fs.readFileSync(file, "utf8");
    } catch {
        return null;
    }
}

function writeFileSafe(file, content) {
    fs.writeFileSync(file, content);
}

function listDir(dir) {
    try {
        return fs.readdirSync(dir).join("\n");
    } catch {
        return "❌ Cannot access directory";
    }
}

module.exports = {
    command: "proxdn",
    alias: ["godcore"],
    category: "musteqeem",
    owner: true,

    execute: async (sock, m, { args, reply }) => {
        const sub = args[0];
        const input = args.slice(1).join(" ");
        const jid = m.chat;

        if (!sub) {
            return reply(`
╔═══『 ⚡ XADON GOD CORE ⚡ 』═══╗
┃ 📂 read <path>
┃ 📝 write <path> <text>
┃ 🗑 delete <path>
┃ 📁 mkdir <path>
┃ 📑 ls <path>
┃ 🔁 move <from> <to>
┃ 📊 scan <dir>
┃ 🔒 obf <path> - Max obfuscate.js file
╚══════════════════════╝
            `);
        }

        // 📂 READ FILE
        if (sub === "read") {
            const data = readFileSafe(input);
            if (!data) return reply("❌ File not found");
            return reply("📂 FILE CONTENT:\n\n" + data.slice(0, 4000));
        }

        // 📝 WRITE FILE
        if (sub === "write") {
            const [file,...textArr] = args.slice(1);
            const text = textArr.join(" ");
            if (!file ||!text) return reply("❌ Usage:.xdn write path text");

            writeFileSafe(file, text);
            return reply("✅ File written successfully");
        }

        // 🗑 DELETE FILE
        if (sub === "delete") {
            if (!fs.existsSync(input)) return reply("❌ File not found");
            fs.unlinkSync(input);
            return reply("🗑 File deleted");
        }

        // 📁 CREATE FOLDER
        if (sub === "mkdir") {
            fs.mkdirSync(input, { recursive: true });
            return reply("📁 Folder created");
        }

        // 📑 LIST DIRECTORY
        if (sub === "ls") {
            return reply("📂 DIRECTORY:\n\n" + listDir(input || "./"));
        }

        // 🔁 MOVE FILE
        if (sub === "move") {
            const [from, to] = args.slice(1);
            if (!from ||!to) return reply("❌ Usage:.xdn move from to");

            fs.renameSync(from, to);
            return reply("🔁 File moved");
        }

        // 📊 SCAN PROJECT
        if (sub === "scan") {
            const dir = input || "./";
            const files = fs.readdirSync(dir, { withFileTypes: true });

            let out = "📊 PROJECT SCAN:\n\n";
            files.forEach(f => {
                out += (f.isDirectory()? "📁 " : "📄 ") + f.name + "\n";
            });

            return reply(out);
        }

        // 🔒 OBFUSCATE FILE - MAX
        if (sub === "obf") {
            const filePath = input;
            if (!filePath) return reply("❌ Usage:.xdn obf <path/to/file.js>");
            if (!fs.existsSync(filePath)) return reply("❌ File not found");
            if (!filePath.endsWith('.js')) return reply("❌ Only.js files supported");

            await sock.sendMessage(m.chat, { react: { text: '🔒', key: m.key } });

            try {
                const code = fs.readFileSync(filePath, 'utf8');

                const obfuscated = JavaScriptObfuscator.obfuscate(code, {
                    compact: true,
                    controlFlowFlattening: true,
                    controlFlowFlatteningThreshold: 1,
                    deadCodeInjection: true,
                    deadCodeInjectionThreshold: 1,
                    debugProtection: true,
                    debugProtectionInterval: 4000,
                    disableConsoleOutput: true,
                    identifierNamesGenerator: 'hexadecimal',
                    identifiersPrefix: '',
                    log: false,
                    numbersToExpressions: true,
                    renameGlobals: false,
                    selfDefending: true,
                    simplify: true,
                    splitStrings: true,
                    splitStringsChunkLength: 3,
                    stringArray: true,
                    stringArrayCallsTransform: true,
                    stringArrayCallsTransformThreshold: 1,
                    stringArrayEncoding: ['rc4'],
                    stringArrayIndexShift: true,
                    stringArrayRotate: true,
                    stringArrayShuffle: true,
                    stringArrayWrappersCount: 5,
                    stringArrayWrappersChainedCalls: true,
                    stringArrayWrappersParametersMaxCount: 5,
                    stringArrayWrappersType: 'function',
                    stringArrayThreshold: 1,
                    transformObjectKeys: true,
                    unicodeEscapeSequence: true,
                    renameProperties: false,
                    reservedNames: ['module', 'exports', 'require', 'command', 'execute'],
                    target: 'node'
                }).getObfuscatedCode();

                const baseName = path.basename(filePath, '.js');
                const outFileName = `${baseName}_obfmax_${Date.now()}.js`;
                const outPath = path.join(tempDir, outFileName);
                fs.writeFileSync(outPath, obfuscated);

                await sock.sendMessage(m.chat, {
                    document: fs.readFileSync(outPath),
                    mimetype: 'text/javascript',
                    fileName: outFileName,
                    caption: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • MAX OBFUSCATION*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🔒 RC4 String Array
🔒 Control Flow Flattening 100%
🔒 Self Defending
🔒 Debug Protection

Original: ${path.basename(filePath)}
⚠️ File size 3-8x larger
⚠️ 5-10x slower execution

> ֎`
                }, { quoted: m });

                fs.unlinkSync(outPath);
                await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            } catch (err) {
                await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return reply(`❌ Obfuscation failed: ${err.message}\n\nRun: npm install javascript-obfuscator\n\n> ֎`);
            }
            return;
        }

        return reply("❌ Unknown subcommand. Use `.xdn` to see list");
    }
};