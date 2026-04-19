const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

async function convertAudio(sock, m, filter) {

    if (!m.quoted) {
        return sock.sendMessage(m.chat, {
            text: '⚠️ Reply to an audio/voice note\n> XADON AI'
        }, { quoted: m });
    }

    try {

        const buffer = await m.quoted.download();
        const input = path.join(tempDir, Date.now() + '_in.mp3');
        const output = path.join(tempDir, Date.now() + '_out.ogg');

        fs.writeFileSync(input, buffer);

        return new Promise((resolve) => {

            ffmpeg(input)
                .audioFilters(filter)
                .audioCodec('libopus')
                .audioBitrate('128k')
                .format('ogg')
                .on('end', async () => {

                    await sock.sendMessage(m.chat, {
                        audio: fs.readFileSync(output),
                        mimetype: 'audio/ogg; codecs=opus',
                        ptt: true
                    }, { quoted: m });

                    fs.unlinkSync(input);
                    fs.unlinkSync(output);

                    resolve();
                })
                .on('error', (err) => {
                    console.log('[AUDIO ERROR]', err.message);
                    resolve();
                })
                .save(output);

        });

    } catch (err) {
        console.log('[CONVERT ERROR]', err.message);
    }
}

module.exports = { convertAudio };