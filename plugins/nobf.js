const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

module.exports = {
    command: 'nobfuscate',
    alias: ['obf'],
    description: 'Obfuscate JS without breaking module.exports',
    category: 'tools',
    owner: true,

    execute: async (sock, m, { args, reply }) => {
        let code = '';

        if (m.quoted && m.quoted.documentMessage?.mimetype === 'text/javascript') {
            const quotedPath = await sock.downloadMediaMessage(m.quoted);
            code = fs.readFileSync(quotedPath, 'utf8');
            fs.unlinkSync(quotedPath);
        } else if (args.length > 0) {
            code = args.join(' ');
        } else {
            return reply(`֎ Reply to a .js file with .obfuscate\n\n> ֎`);
        }

        await sock.sendMessage(m.chat, { react: { text: '⚡', key: m.key } });

        try {
            const obfuscated = JavaScriptObfuscator.obfuscate(code, {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 0.75,
                deadCodeInjection: false, // DISABLED - breaks modules
                identifierNamesGenerator: 'hexadecimal',
                renameGlobals: false, // CRITICAL - don't rename module.exports
                selfDefending: false, // CRITICAL - breaks on Node
                stringArray: true,
                stringArrayEncoding: ['rc4'],
                stringArrayThreshold: 1,
                transformObjectKeys: false, // CRITICAL - keeps command/execute keys
                unicodeEscapeSequence: false,
                // Preserve these globals
                reservedNames: [
                    'module',
                    'exports', 
                    'require',
                    'command',
                    'execute',
                    'sock',
                    'm',
                    'reply'
                ],
                target: 'node'
            }).getObfuscatedCode();

            const fileName = `obf_${Date.now()}.js`;
            const filePath = path.join(tempDir, fileName);
            fs.writeFileSync(filePath, obfuscated);

            await sock.sendMessage(m.chat, {
                document: fs.readFileSync(filePath),
                mimetype: 'text/javascript',
                fileName: fileName,
                caption: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • OBFUSCATION COMPLETE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ module.exports preserved
✅ Command will work

⚠️ Restart bot after replacing file

> ֎`
            }, { quoted: m });

            fs.unlinkSync(filePath);
            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`❌ ${err.message}\n\n> ֎`);
        }
    }
};