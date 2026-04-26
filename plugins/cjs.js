const fs = require('fs');
const path = require('path');

module.exports = {
    command: 'comjs',
    alias: ['compressjs', 'minifyjs', 'js'],
    description: 'Create a JavaScript file from raw code (reply to.js document or text message)',
    category: 'documents',
    usage: '.comjs <filename.js> (reply to code) OR.comjs <filename.js> <code>',

    execute: async (sock, m, { args, reply }) => {

        let customFileName = args[0]?.trim();
        if (customFileName &&!customFileName.endsWith('.js')) customFileName += '.js';

        const quoted = m.quoted;
        let code = '';
        let sourceFileName = 'code.js';
        let isDocument = false;

        if (quoted) {
            const mtype = quoted.mtype || '';
            if (mtype === 'documentMessage' && quoted.fileName?.endsWith('.js')) {
                isDocument = true;
                sourceFileName = quoted.fileName;
                try {
                    const buffer = await quoted.download();
                    if (!buffer || buffer.length === 0)
                        return reply('❌ Failed to download file\n> ֎');
                    code = buffer.toString('utf8');
                } catch (err) {
                    return reply('❌ Failed to read document\n> ֎');
                }
            } else if (mtype === 'conversation' || mtype === 'extendedTextMessage') {
                code = quoted.text || quoted.body || '';
                if (!code.trim())
                    return reply('❌ No JavaScript code found in the replied message\n> ֎');
            } else {
                return reply('❌ Reply to a.js document or text message containing JavaScript code\n> ֎');
            }
        } else {
            if (!customFileName)
                return reply(`֎ ✪ *XADON AI • COMJS* ✪ ֎

📝 Usage:.comjs <filename.js> (reply to code)
OR:.comjs <filename.js> <code>

Example:.comjs index.js console.log("hi")

> ֎`);

            code = args.slice(1).join(' ').trim();
            if (!code)
                return reply('❌ No code provided after the filename\n> ֎');
        }

        let finalFileName = customFileName || (isDocument? sourceFileName : 'code.js');
        if (!finalFileName.endsWith('.js')) finalFileName += '.js';

        if (!code.trim())
            return reply('❌ No code to package\n> ֎');

        await sock.sendMessage(m.chat, { react: { text: '📄', key: m.key } });

        try {

            const tempDir = path.join(__dirname, '../../temp');
            if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
            const outPath = path.join(tempDir, finalFileName);
            fs.writeFileSync(outPath, code, 'utf8');

            const stats = fs.statSync(outPath);
            const sizeKB = (stats.size / 1024).toFixed(2);

            await sock.sendMessage(m.chat, {
                document: fs.readFileSync(outPath),
                fileName: finalFileName,
                mimetype: 'application/javascript',
                caption: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • JAVASCRIPT FILE CREATED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

⎙ Filename: ${finalFileName}
⎙ Size: ${stats.size} bytes (${sizeKB} KB)

⚡ File ready to download

> ֎`
            }, { quoted: m });

            fs.unlinkSync(outPath);
            await sock.sendMessage(m.chat, { react: { text: '🕸️', key: m.key } });

        } catch (err) {

            console.error('[COMJS ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Failed to create JavaScript file\n\n';
            msg += `• ${err.message || 'Unknown error'}`;

            reply(msg + '\n\n> ֎');
        }
    }
};