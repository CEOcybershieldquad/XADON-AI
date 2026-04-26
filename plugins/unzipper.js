const fs = require('fs')
const path = require('path')
const unzipper = require('unzipper')

module.exports = {
    command: 'unzip',
    alias: ['extract', 'unarchive'],
    description: 'Extract files from a.zip archive',
    category: 'documents',
    usage: '.unzip (reply to a.zip file)',

    execute: async (sock, m, { reply }) => {

        const quoted = m.quoted
        if (!quoted || quoted.mtype !== 'documentMessage') {
            return reply(`֎ ✪ *XADON AI • UNZIP* ✪ ֎

📦 Usage: Reply to a.zip file with.unzip

> ֎`)
        }

        const fileName = quoted.fileName || ''
        if (!fileName.endsWith('.zip')) {
            return reply('❌ Replied document must be a.zip file\n> ֎')
        }

        await sock.sendMessage(m.chat, { react: { text: '📦', key: m.key } });

        try {

            const buffer = await quoted.download()
            if (!buffer || buffer.length < 100) {
                return reply('❌ Failed to download zip or file is empty\n> ֎')
            }

            const tempDir = path.join(__dirname, '../../temp')
            if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

            const extractDir = path.join(tempDir, `extract_${Date.now()}`)
            fs.mkdirSync(extractDir, { recursive: true })

            // Extract zip
            const directory = await unzipper.Open.buffer(buffer)
            let fileCount = 0
            let totalSize = 0

            for (const file of directory.files) {
                if (file.type === 'File') {
                    const filePath = path.join(extractDir, file.path)
                    const fileDir = path.dirname(filePath)
                    
                    // Create subdirectories if needed
                    if (!fs.existsSync(fileDir)) {
                        fs.mkdirSync(fileDir, { recursive: true })
                    }

                    const content = await file.buffer()
                    fs.writeFileSync(filePath, content)
                    fileCount++
                    totalSize += content.length
                }
            }

            if (fileCount === 0) {
                fs.rmSync(extractDir, { recursive: true, force: true })
                return reply('❌ Zip file is empty or contains no files\n> ֎')
            }

            // Get list of extracted files
            const extractedFiles = []
            const readDirRecursive = (dir, base = '') => {
                const items = fs.readdirSync(dir)
                for (const item of items) {
                    const fullPath = path.join(dir, item)
                    const relativePath = path.join(base, item)
                    if (fs.statSync(fullPath).isDirectory()) {
                        readDirRecursive(fullPath, relativePath)
                    } else {
                        extractedFiles.push(relativePath)
                    }
                }
            }
            readDirRecursive(extractDir)

            // Send each file
            let sentCount = 0
            for (const filePath of extractedFiles) {
                const fullPath = path.join(extractDir, filePath)
                const fileBuffer = fs.readFileSync(fullPath)
                
                // Detect mimetype from extension
                const ext = path.extname(filePath).toLowerCase()
                let mimetype = 'application/octet-stream'
                if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) mimetype = `image/${ext.slice(1)}`
                else if (['.mp4', '.mkv', '.mov'].includes(ext)) mimetype = 'video/mp4'
                else if (['.mp3', '.ogg', '.wav'].includes(ext)) mimetype = `audio/${ext.slice(1)}`
                else if (ext === '.pdf') mimetype = 'application/pdf'
                else if (ext === '.txt') mimetype = 'text/plain'
                else if (ext === '.json') mimetype = 'application/json'

                await sock.sendMessage(m.chat, {
                    document: fileBuffer,
                    mimetype: mimetype,
                    fileName: path.basename(filePath),
                    caption: `📄 Extracted from: ${fileName}\n> ֎`
                })
                sentCount++
                
                // Small delay to avoid spam
                await new Promise(r => setTimeout(r, 500))
            }

            // Cleanup
            fs.rmSync(extractDir, { recursive: true, force: true })

            const sizeKB = (totalSize / 1024).toFixed(2)
            await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            
            reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • ZIP EXTRACTED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

⎙ Archive: ${fileName}
⎙ Files extracted: ${sentCount}
⎙ Total size: ${sizeKB} KB

⚡ All files sent

> ֎`)

        } catch (err) {

            console.error('[UNZIP ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Failed to extract zip file\n\n';
            
            if (err.message?.includes('unzipper')) {
                msg += '• Missing unzipper package. Run: npm install unzipper';
            } else if (err.message?.includes('corrupt')) {
                msg += '• Zip file is corrupted or invalid';
            } else {
                msg += `• ${err.message || 'Unknown error'}`;
            }

            reply(msg + '\n\n> ֎');
        }
    }
};