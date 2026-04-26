const { PDFDocument } = require('pdf-lib');

module.exports = {
    command: 'pdf',
    aliases: ['topdf', 'imgtopdf'],
    category: 'documents',
    description: 'Build multi-page PDF from images (JPG/PNG only)',

    emoji: {
        wait:     '✨',
        success:  '📄',
        error:    '❌',
        thinking: '⚡',
        info:     'ℹ️'
    },

    cooldown: 10,

    execute: async (sock, m, { args, q, prefix, command, reply }) => {
        const { emoji } = module.exports;

        // Initialize global queue if missing
        if (!global.pdfQueue) global.pdfQueue = {};
        const chatId = m.key.remoteJid;
        if (!global.pdfQueue[chatId]) global.pdfQueue[chatId] = { pages: [] };

        const queue = global.pdfQueue[chatId];
        const cmd = args[0]?.toLowerCase() || '';

        try {
            // ── No subcommand → show status & help ──────────────────────
            if (!cmd) {
                let msg = `${emoji.info} *PDF Builder*\n\n`;

                if (queue.pages.length > 0) {
                    msg += `📑 *Pages in queue:* ${queue.pages.length}\n\n`;
                    queue.pages.forEach((p, i) => {
                        const type = p.mime.includes('jpeg') ? 'JPG' : 'PNG';
                        msg += `${i + 1}. ${type} image\n`;
                    });
                } else {
                    msg += `Queue is empty.\n`;
                }

                msg += `\n*Commands:*\n` +
                       `• ${prefix + command} add → add replied image\n` +
                       `• ${prefix + command} del <number> → remove page\n` +
                       `• ${prefix + command} clear → clear queue\n` +
                       `• ${prefix + command} push → generate & send PDF\n`;

                return reply(msg);
            }

            // ── ADD image ────────────────────────────────────────────────
            if (cmd === 'add') {
                const quoted = m.quoted;
                if (!quoted) return reply(`${emoji.error} Reply to a JPG or PNG image`);

                const isImage = quoted.isImage || quoted.message?.imageMessage || quoted.mimetype?.startsWith('image/');
                if (!isImage) return reply(`${emoji.error} Reply to an *image* only`);

                const mime = quoted.mimetype || quoted.message?.imageMessage?.mimetype || '';
                if (!mime.includes('jpeg') && !mime.includes('png')) {
                    return reply(`${emoji.error} Only JPG and PNG images are supported`);
                }

                const buffer = await quoted.download();

                queue.pages.push({ buffer, mime });

                await reply(
                    `${emoji.success} Page added!\n` +
                    `Total pages: *${queue.pages.length}*`
                );

                await sock.sendMessage(chatId, { react: { text: emoji.success, key: m.key } });
                return;
            }

            // ── DELETE page ─────────────────────────────────────────────
            if (cmd === 'del') {
                const num = parseInt(args[1]);
                if (!num || num < 1 || num > queue.pages.length) {
                    return reply(
                        `${emoji.error} Invalid page number\n` +
                        `Current pages: ${queue.pages.length}`
                    );
                }

                queue.pages.splice(num - 1, 1);

                return reply(
                    `${emoji.success} Page ${num} removed\n` +
                    `Remaining: *${queue.pages.length}*`
                );
            }

            // ── CLEAR queue ─────────────────────────────────────────────
            if (cmd === 'clear') {
                queue.pages = [];
                return reply(`${emoji.success} Queue cleared!`);
            }

            // ── PUSH / generate PDF ─────────────────────────────────────
            if (cmd === 'push') {
                if (queue.pages.length === 0) {
                    return reply(`${emoji.error} Queue is empty. Add images first.`);
                }

                await reply(`\( {emoji.wait} Building PDF ( \){queue.pages.length} pages)…`);

                await sock.sendMessage(chatId, { react: { text: emoji.thinking, key: m.key } });

                const pdfDoc = await PDFDocument.create();

                for (const pageData of queue.pages) {
                    const page = pdfDoc.addPage([595, 842]); // A4 size (portrait)

                    let img;
                    if (pageData.mime.includes('jpeg') || pageData.mime.includes('jpg')) {
                        img = await pdfDoc.embedJpg(pageData.buffer);
                    } else if (pageData.mime.includes('png')) {
                        img = await pdfDoc.embedPng(pageData.buffer);
                    }

                    const { width: imgW, height: imgH } = img;

                    // Scale to fit \~95% of page while preserving aspect ratio
                    const scale = Math.min(
                        (page.getWidth() * 0.95) / imgW,
                        (page.getHeight() * 0.95) / imgH
                    );

                    const drawW = imgW * scale;
                    const drawH = imgH * scale;

                    // Center the image
                    const x = (page.getWidth() - drawW) / 2;
                    const y = (page.getHeight() - drawH) / 2;

                    page.drawImage(img, {
                        x,
                        y,
                        width: drawW,
                        height: drawH,
                    });
                }

                const pdfBytes = await pdfDoc.save();
                const pdfBuffer = Buffer.from(pdfBytes);

                const fileName = `XADON_PDF_${Date.now()}.pdf`;

                await sock.sendMessage(chatId, {
                    document: pdfBuffer,
                    mimetype: 'application/pdf',
                    fileName,
                    caption:
                        `📄 *${fileName}*\n` +
                        `├ Pages → ${queue.pages.length}\n` +
                        `├ Created with XADON\n` +
                        `└ ${new Date().toLocaleString('en-NG')}`
                }, { quoted: m });

                // Reset queue after success
                queue.pages = [];

                await reply(
                    `${emoji.success} PDF sent!\n` +
                    `→ *\( {fileName}* ( \){queue.pages.length} pages)`
                );

                await sock.sendMessage(chatId, { react: { text: emoji.success, key: m.key } });
                return;
            }

            // Unknown subcommand
            return reply(`\( {emoji.error} Unknown command\nType * \){prefix + command}* to see usage.`);

        } catch (err) {
            console.error('[XADON-PDF]', err);
            await reply(
                `${emoji.error} Failed to process PDF\n` +
                `→ ${err.message?.slice(0, 90) || 'Unknown error'}`
            );
            await sock.sendMessage(chatId, { react: { text: emoji.error, key: m.key } });
        }
    }
};