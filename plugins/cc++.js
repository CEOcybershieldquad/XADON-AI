const fs = require('fs');
const path = require('path');

module.exports = {
    command: 'comcpp',
    alias: ['compresscpp', 'minifycpp', 'cpp'],
    description: 'Create a C++ file from raw code (reply to.cpp document or text message)',
    category: 'documents',
    usage: '.comcpp <filename.cpp> (reply to code) OR.comcpp <filename.cpp> <code>',

    execute: async (sock, m, { args, reply }) => {

        let customFileName = args[0]?.trim();
        if (customFileName &&!customFileName.endsWith('.cpp')) customFileName += '.cpp';

        const quoted = m.quoted;
        let code = '';
        let sourceFileName = 'code.cpp';
        let isDocument = false;

        if (quoted) {
            const mtype = quoted.mtype || '';
            // Case: replied to a.cpp document
            if (mtype === 'documentMessage' && quoted.fileName?.endsWith('.cpp')) {
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
            }
            // Case: replied to a text message
            else if (mtype === 'conversation' || mtype === 'extendedTextMessage') {
                code = quoted.text || quoted.body || '';
                if (!code.trim())
                    return reply('❌ No C++ code found in the replied message\n> ֎');
            } else {
                return reply('❌ Reply to a.cpp document or text message containing C++ code\n> ֎');
            }
        } else {
            // Case: code provided directly in command
            if (!customFileName)
                return reply(`֎ ✪ *XADON AI • COMCPP* ✪ ֎

📝 Usage:.comcpp <filename.cpp> (reply to code)
OR:.comcpp <filename.cpp> <code>

Example:.comcpp main.cpp cout << "Hello";

> ֎`);

            code = args.slice(1).join(' ').trim();
            if (!code)
                return reply('❌ No code provided after the filename\n> ֎');
        }

        // Determine final filename
        let finalFileName = customFileName || (isDocument? sourceFileName : 'code.cpp');
        if (!finalFileName.endsWith('.cpp')) finalFileName += '.cpp';

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
                mimetype: 'text/x-c++src',
                caption: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • C++ FILE CREATED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

⎙ Filename: ${finalFileName}
⎙ Size: ${stats.size} bytes (${sizeKB} KB)

⚡ File ready to download

> ֎`
            }, { quoted: m });

            fs.unlinkSync(outPath);
            await sock.sendMessage(m.chat, { react: { text: '🧑‍💻', key: m.key } });

        } catch (err) {

            console.error('[COMCPP ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Failed to create C++ file\n\n';
            msg += `• ${err.message || 'Unknown error'}`;

            reply(msg + '\n\n> ֎');
        }
    }
};