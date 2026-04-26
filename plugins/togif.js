const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const sharp = require('sharp')

module.exports = {
    command: 'togif',
    alias: ['sticker2gif', 'stktogif', 'stickergif'],
    description: 'Convert sticker to GIF with watermark',
    category: 'media',
    usage: '.togif (reply to sticker)',

    execute: async (sock, m, { reply }) => {

        const quoted = m.quoted || m
        const mime = quoted.mimetype || ''

        if (!/webp/.test(mime) &&!quoted.isSticker)
            return reply(`✨ ✪ *XADON AI • TOGIF* ✪ ✨

📎 Reply to a sticker to convert it to GIF

Usage:.togif

> XADON AI`);

        await sock.sendMessage(m.chat, {
            react: { text: "⏳", key: m.key }
        });

        try {

            const media = await quoted.download()
            const metadata = await sharp(media).metadata()
            const isAnimated = metadata.pages > 1

            const tempDir = path.join(__dirname, '../../temp')
            if (!fs.existsSync(tempDir))
                fs.mkdirSync(tempDir, { recursive: true })

            if (isAnimated) {

                const input = path.join(tempDir, `stk_${Date.now()}.webp`)
                const frameDir = path.join(tempDir, `frames_${Date.now()}`)
                const output = path.join(tempDir, `gif_${Date.now()}.mp4`)

                fs.writeFileSync(input, media)
                fs.mkdirSync(frameDir)

                const frames = []

                for (let i = 0; i < metadata.pages; i++) {
                    const frameFile = path.join(frameDir, `frame_${String(i).padStart(4,'0')}.png`)

                    frames.push(
                        sharp(media, { page: i })
                       .resize(512, 512, { fit: 'cover' })
                       .png()
                       .toFile(frameFile)
                    )
                }

                await Promise.all(frames)

                const delay = metadata.delay?.[0] || 100
                const fps = Math.round(1000 / delay) || 15

                const cmd = `ffmpeg -y -framerate ${fps} -i "${frameDir}/frame_%04d.png" -vf "scale=512:-1:flags=lanczos,drawtext=text='XADON AI':x=(w-text_w)/2:y=(h-text_h)/2:fontsize=30:fontcolor=white@0.6:borderw=2:bordercolor=black@0.7" -loop 0 -c:v libx264 -pix_fmt yuv420p -movflags +faststart -an "${output}"`

                await new Promise((resolve, reject) => {
                    exec(cmd, (err) => {
                        if (err) reject(err)
                        else resolve()
                    })
                })

                const buffer = fs.readFileSync(output)

                await sock.sendMessage(
                    m.chat,
                    {
                        video: buffer,
                        gifPlayback: true,
                        caption: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *XADON AI • STICKER TO GIF*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

⚡ Conversion successful

> XADON AI`
                    },
                    { quoted: m }
                )

                fs.rmSync(frameDir, { recursive: true, force: true })
                fs.unlinkSync(input)
                fs.unlinkSync(output)

                await sock.sendMessage(m.chat, {
                    react: { text: "✅", key: m.key }
                })

            } else {

                const img = await sharp(media)
               .resize(512, 512, { fit: 'cover' })
               .png()
               .toBuffer()

                await sock.sendMessage(
                    m.chat,
                    {
                        image: img,
                        caption: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *XADON AI • STICKER TO IMG*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

⚡ Static sticker converted

> XADON AI`
                    },
                    { quoted: m }
                )

                await sock.sendMessage(m.chat, {
                    react: { text: "✅", key: m.key }
                })
            }

        } catch (err) {

            console.error('[TOGIF ERROR]', err?.message || err);

            await sock.sendMessage(m.chat, {
                react: { text: "❌", key: m.key }
            });

            let msg = '❌ Failed to convert sticker\n\n';

            if (err.message?.includes('ffmpeg')) {
                msg += '• FFmpeg not installed or error during conversion';
            } else if (err.message?.includes('sharp')) {
                msg += '• Sharp library error - check installation';
            } else {
                msg += `• ${err.message || 'Unknown error'}`;
            }

            reply(msg + '\n> XADON AI');
        }
    }
};