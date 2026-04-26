const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { Sticker } = require('wa-sticker-formatter');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
    command: 'stickerpk',
    alias: ['stpk', 'setpack', 'pk', 'steal'],
    description: 'Steal sticker with ֎ pack and custom author name',
    category: 'tools',
    usage: '.pk <author name> (reply to a sticker)',

    execute: async (sock, m, { args, reply }) => {

        const author = args.join(' ').trim();
        
        if (!author)
            return reply(`֎ ✪ *XADON AI • STICKER PK* ✪ ֎

📎 Usage: .pk <author name> (reply to a sticker)

Example: .pk Lagos

> ֎`);

        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || '';
        
        if (!/webp/.test(mime))
            return reply('⚠️ Reply to a sticker\n> ֎');

        await sock.sendMessage(m.chat, { react: { text: '🥏', key: m.key } });

        try {

            // Download original sticker buffer
            const stream = await downloadContentFromMessage(quoted.msg || quoted, 'sticker');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            const originalSizeKB = buffer.length / 1024;

            // Detect if it's animated (WebP animation)
            const isAnimated = buffer.toString('hex', 0, 16).includes('414e494d');

            let finalBuffer = buffer;

            // Helper to re-encode with wa-sticker-formatter
            const reencodeWithQuality = async (q) => {
                const sticker = new Sticker(buffer, {
                    pack: '֎',
                    author: author,
                    type: 'full',
                    quality: q
                });
                return await sticker.toBuffer();
            };

            // If original is already under 500 KB, just apply metadata with high quality
            if (originalSizeKB <= 500) {
                finalBuffer = await reencodeWithQuality(80);
            } else {
                // Original too big – need compression
                const qualities = [70, 60, 50, 40, 30];
                for (const q of qualities) {
                    finalBuffer = await reencodeWithQuality(q);
                    if (finalBuffer.length / 1024 <= 500) {
                        break;
                    }
                }

                // If still too big, use ffmpeg as last resort for animated stickers
                if (finalBuffer.length / 1024 > 500 && isAnimated) {
                    const tempDir = path.join(__dirname, '../../temp');
                    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

                    const inputPath = path.join(tempDir, `steal_${Date.now()}.webp`);
                    const outputPath = path.join(tempDir, `steal_out_${Date.now()}.webp`);

                    fs.writeFileSync(inputPath, buffer);

                    // Aggressive ffmpeg compression
                    const cmd = `ffmpeg -y -i "${inputPath}" -vf "fps=8,scale=512:512:force_original_aspect_ratio=increase,crop=512:512:(iw-ow)/2:(ih-oh)/2,format=yuva420p" -c:v libwebp -lossless 0 -q:v 30 -loop 0 -an -preset default -compression_level 6 "${outputPath}"`;

                    await new Promise((resolve, reject) => {
                        exec(cmd, (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });

                    finalBuffer = fs.readFileSync(outputPath);

                    // Cleanup
                    fs.unlinkSync(inputPath);
                    fs.unlinkSync(outputPath);

                    // Apply metadata with minimal quality
                    if (finalBuffer.length / 1024 <= 500) {
                        const sticker = new Sticker(finalBuffer, {
                            pack: '֎',
                            author: author,
                            type: 'full',
                            quality: 30
                        });
                        finalBuffer = await sticker.toBuffer();
                    }
                }

                // Final check
                if (finalBuffer.length / 1024 > 500) {
                    await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return reply('❌ Sticker too complex to fit WhatsApp limit even after compression\n> ֎');
                }
            }

            await sock.sendMessage(m.chat, { sticker: finalBuffer }, { quoted: m });
            await sock.sendMessage(m.chat, { react: { text: '😎', key: m.key } });

        } catch (err) {

            console.error('[STICKERPK ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

            let msg = '❌ Failed to take sticker\n\n';

            if (err.message?.includes('ffmpeg')) {
                msg += '• FFmpeg error during compression';
            } else if (err.message?.includes('sticker')) {
                msg += '• Invalid sticker format';
            } else {
                msg += `• ${err.message || 'Unknown error'}`;
            }

            reply(msg + '\n> ֎');
        }
    }
};