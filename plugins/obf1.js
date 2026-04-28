const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

module.exports = {
    command: 'obfuscate',
    alias: ['obf', 'encryptjs'],
    description: 'Obfuscate JavaScript code locally - same style as your example',
    category: 'musteqeem',
    owner: true,
    usage: '.obfuscate <reply to .js file or paste code>',

    execute: async (sock, m, { args, reply }) => {
        let code = '';

        // Get code from reply or args
        if (m.quoted && m.quoted.documentMessage?.mimetype === 'text/javascript') {
            const quotedPath = await sock.downloadMediaMessage(m.quoted);
            code = fs.readFileSync(quotedPath, 'utf8');
            fs.unlinkSync(quotedPath);
        } else if (m.quoted && m.quoted.mimetype === 'text/plain') {
            const quotedPath = await sock.downloadMediaMessage(m.quoted);
            code = fs.readFileSync(quotedPath, 'utf8');
            fs.unlinkSync(quotedPath);
        } else if (args.length > 0) {
            code = args.join(' ');
        } else {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`֎ ✪ *XADON AI • OBFUSCATOR* ✪ ֎

❌ No code provided

Usage:
1. Reply to a.js file:.obfuscate
2. Paste code:.obfuscate console.log('hello')

> ֎`);
        }

        if (code.length < 10) {
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply(`❌ Code too short to obfuscate\n\n> ֎`);
        }

        await sock.sendMessage(m.chat, { react: { text: '⚡', key: m.key } });

        try {
            // Obfuscate with same settings as your example
            const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 1,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 0.4,
                debugProtection: false,
                debugProtectionInterval: 0,
                disableConsoleOutput: false,
                identifierNamesGenerator: 'hexadecimal',
                log: false,
                numbersToExpressions: true,
                renameGlobals: false,
                selfDefending: true,
                simplify: true,
                splitStrings: true,
                splitStringsChunkLength: 5,
                stringArray: true,
                stringArrayCallsTransform: true,
                stringArrayCallsTransformThreshold: 1,
                stringArrayEncoding: ['rc4'],
                stringArrayIndexShift: true,
                stringArrayRotate: true,
                stringArrayShuffle: true,
                stringArrayWrappersCount: 5,
                stringArrayWrappersChainedCalls: true,
                stringArrayWrappersParametersMaxCount: 4,
                stringArrayWrappersType: 'function',
                stringArrayThreshold: 1,
                transformObjectKeys: true,
                unicodeEscapeSequence: false,
                // Force Function constructor output like your example
                target: 'node'
            });

            const obfuscated = obfuscationResult.getObfuscatedCode();

            if (!obfuscated) {
                throw new Error('Obfuscation returned empty code');
            }

            // Save to file and send
            const fileName = `obfuscated_${Date.now()}.js`;
            const filePath = path.join(tempDir, fileName);
            fs.writeFileSync(filePath, obfuscated);

            await sock.sendMessage(m.chat, {
                document: fs.readFileSync(filePath),
                mimetype: 'text/javascript',
                fileName: fileName,
                caption: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • OBFUSCATION COMPLETE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📊 Original: ${code.length} chars
🔒 Obfuscated: ${obfuscated.length} chars
⚡ Method: Local RC4 + Control Flow
🎯 Output: Function constructor

⚠️ Slower execution, can't debug

> ֎`
            }, { quoted: m });

            fs.unlinkSync(filePath);
            await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

        } catch (err) {
            console.error('[OBFUSCATE ERROR]', err?.message || err);
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Local obfuscation failed\n\n';
            if (err.message.includes('Unexpected token')) {
                msg += '• Invalid JavaScript syntax\n• Check your code';
            } else if (err.message.includes('Cannot find module')) {
                msg += '• Run: npm install javascript-obfuscator';
            } else {
                msg += `• ${err.message}`;
            }

            return reply(msg + '\n\n> ֎');
        }
    }
};