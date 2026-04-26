const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

module.exports = {
    command: 'zip',
    alias: ['tozip', 'archive', 'zipper'],
    description: 'Build.zip file: add files one by one then push',
    category: 'documents',
    usage: '.zip <number> | push | list | clear | remove <num>',

    execute: async (sock, m, { args, reply }) => {
        const sender = m.sender
        if (!global.zipQueues) global.zipQueues = {}
        if (!global.zipQueues[sender]) global.zipQueues[sender] = []

        const queue = global.zipQueues[sender]
        const cmd = args[0]?.toLowerCase()

        // ── HELP / LIST ────────────────────────────────────────
        if (!cmd || cmd === 'list') {
            let msg = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • ZIP BUILDER*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📦 Items in queue: ${queue.length}\n\n`

            if (queue.length === 0) {
                msg += 'Queue empty\n\n'
            } else {
                queue.forEach((item, i) => {
                    msg += `${i + 1}. ${item.name}\n`
                })
                msg += '\n'
            }

            msg += `Commands:\n`
            msg += `•.zip 1 → add replied media as #1\n`
            msg += `•.zip 2 → add as #2 etc\n`
            msg += `•.zip push → create & send.zip\n`
            msg += `•.zip list → show queue\n`
            msg += `•.zip clear → empty queue\n`
            msg += `•.zip remove <num> → remove item\n\n`
            msg += `> ֎`

            await sock.sendMessage(m.chat, { react: { text: '📦', key: m.key } });
            return reply(msg)
        }

        // ── CLEAR QUEUE ────────────────────────────────────────
        if (cmd === 'clear') {
            global.zipQueues[sender] = []
            await sock.sendMessage(m.chat, { react: { text: '🗑️', key: m.key } });
            return reply('✅ Queue cleared\n> ֎')
        }

        // ── REMOVE ITEM ────────────────────────────────────────
        if (cmd === 'remove') {
            const num = parseInt(args[1])
            if (!num || num < 1 || num > queue.length) {
                return reply(`❌ Invalid number. Current items: ${queue.length}\n> ֎`)
            }
            queue.splice(num - 1, 1)
            await sock.sendMessage(m.chat, { react: { text: '🗑️', key: m.key } });
            return reply(`✅ Item ${num} removed\nQueue now has ${queue.length} items\n> ֎`)
        }

        // ── PUSH / CREATE ZIP ──────────────────────────────────
        if (cmd === 'push') {
            if (queue.length === 0) {
                return reply('❌ Queue is empty. Add files first with.zip 1,.zip 2 etc\n> ֎')
            }

            await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

            try {
                const tempDir = path.join(__dirname, '../../temp')
                if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

                const zipName = `xadon_${Date.now()}.zip`
                const zipPath = path.join(tempDir, zipName)
                const output = fs.createWriteStream(zipPath)
                const archive = archiver('zip', { zlib: { level: 6 } })

                archive.pipe(output)

                for (const item of queue) {
                    archive.append(item.buffer, { name: item.name })
                }

                await new Promise((resolve, reject) => {
                    output.on('close', resolve)
                    archive.on('error', reject)
                    archive.finalize()
                })

                if (!fs.existsSync(zipPath) || fs.statSync(zipPath).size < 1000) {
                    fs.unlinkSync(zipPath)
                    await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return reply('❌ Zipping failed - empty or invalid zip\n> ֎')
                }

                const zipBuffer = fs.readFileSync(zipPath)
                const sizeKB = (zipBuffer.length / 1024).toFixed(2);

                await sock.sendMessage(m.chat, {
                    document: zipBuffer,
                    mimetype: 'application/zip',
                    fileName: zipName,
                    caption: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • ZIP FILE CREATED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

⎙ Files: ${queue.length}
⎙ Name: ${zipName}
⎙ Size: ${sizeKB} KB

⚡ Tap to download

> ֎`
                }, { quoted: m })

                // Cleanup
                fs.unlinkSync(zipPath)
                global.zipQueues[sender] = [] // auto clear after push

                await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            } catch (err) {
                console.error('[ZIP ERROR]', err?.message || err);
                await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                reply(`❌ Failed to create zip\n\n• ${err.message || 'Unknown error'}\n\n> ֎`)
            }
            return
        }

        // ── ADD ITEM (.zip 1,.zip 2, etc) ──────────────────
        const index = parseInt(cmd)
        if (isNaN(index) || index < 1) {
            return reply('❌ Use.zip <number> e.g..zip 1 to add replied file\n> ֎')
        }

        const quoted = m.quoted
        if (!quoted) {
            return reply('❌ Reply to a media/file when using.zip <number>\n> ֎')
        }

        const downloadable =
            quoted.mimetype ||
            quoted.isSticker ||
            quoted.isAnimated ||
            quoted.mtype === 'documentMessage' ||
            quoted.mtype === 'imageMessage' ||
            quoted.mtype === 'videoMessage' ||
            quoted.mtype === 'audioMessage'

        if (!downloadable) {
            return reply('❌ Replied message has no downloadable media/file\n> ֎')
        }

        let buffer
        try {
            buffer = await quoted.download()
        } catch {
            return reply('❌ Failed to download replied file\n> ֎')
        }

        if (!buffer || buffer.length < 100) {
            return reply('❌ Downloaded file is empty/corrupted\n> ֎')
        }

        let ext = 'file'
        const mime = quoted.mimetype || ''
        if (mime.startsWith('image/')) ext = mime.split('/')[1] || 'jpg'
        else if (mime.startsWith('video/')) ext = 'mp4'
        else if (mime.startsWith('audio/')) ext = 'mp3'
        else if (mime === 'image/webp') ext = 'webp'
        else if (mime.includes('pdf')) ext = 'pdf'
        else if (mime.includes('zip')) ext = 'zip'
        else if (mime.includes('octet-stream')) ext = 'bin'

        const item = {
            buffer,
            name: `file_${index}.${ext}`,
            ext
        }

        // If position already exists, overwrite
        queue[index - 1] = item

        await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        reply(`✅ Added as item #${index} (${item.name})\nQueue now has ${queue.length} items\n\nUse.zip push to create zip\n> ֎`)
    }
}