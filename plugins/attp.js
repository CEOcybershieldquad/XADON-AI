const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'xattp',
  aliases: ['attp'],
  category:'media',
  description: 'Create animated text sticker',
  usage: '<text>',
  
      execute: async (sock, m, { args, reply }) => {
    try {
      if (args.length === 0) {
        return extra.reply(`❌ Please provide text!\n\nExample: ${extra.prefix || '.'}xattp Hello World`);
      }
      
      const text = args.join(' ');
      if (text.length > 100) {
        return extra.reply('❌ Text is too long! Maximum 100 characters.');
      }
      
      try {
        const mp4Buffer = await renderBlinkingVideoWithFfmpeg(text);
        const webpBuffer = await writeExifVid(mp4Buffer, { packname: '𝐗𝐀𝐃𝐎𝐍 𝐀𝐈' });
        await sock.sendMessage(extra.from, { sticker: webpBuffer }, { quoted: msg });
      } catch (error) {
        console.error('Error generating xattp sticker:', error);
        await extra.reply('❌ Failed to generate the sticker.');
      }
    } catch (error) {
      console.error('ATTP command error:', error);
      await extra.reply('❌ An error occurred while creating animated sticker!');
    }
  }
};

function renderBlinkingVideoWithFfmpeg(text) {
  return new Promise((resolve, reject) => {
    const fontPath = process.platform === 'win32'
      ? 'C:/Windows/Fonts/arialbd.ttf'
      : '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';

    const escapeDrawtextText = (s) => s
      .replace(/\\/g, '\\\\')
      .replace(/:/g, '\\:')
      .replace(/,/g, '\\,')
      .replace(/'/g, "\\'")
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]')
      .replace(/%/g, '\\%');

    const safeText = escapeDrawtextText(text);
    const safeFontPath = process.platform === 'win32'
      ? fontPath.replace(/\\/g, '/').replace(':', '\\:')
      : fontPath;

    // Blink cycle length (seconds) and fast delay ~0.1s per color
    const cycle = 0.3;
    const dur = 1.8; // 6 cycles

    const drawRed = `drawtext=fontfile='${safeFontPath}':text='${safeText}':fontcolor=red:borderw=2:bordercolor=black@0.6:fontsize=56:x=(w-text_w)/2:y=(h-text_h)/2:enable='lt(mod(t\\,${cycle})\\,0.1)'`;
    const drawBlue = `drawtext=fontfile='${safeFontPath}':text='${safeText}':fontcolor=blue:borderw=2:bordercolor=black@0.6:fontsize=56:x=(w-text_w)/2:y=(h-text_h)/2:enable='between(mod(t\\,${cycle})\\,0.1\\,0.2)'`;
    const drawGreen = `drawtext=fontfile='${safeFontPath}':text='${safeText}':fontcolor=green:borderw=2:bordercolor=black@0.6:fontsize=56:x=(w-text_w)/2:y=(h-text_h)/2:enable='gte(mod(t\\,${cycle})\\,0.2)'`;

    const filter = `${drawRed},${drawBlue},${drawGreen}`;

    const args = [
      '-y',
      '-f', 'lavfi',
      '-i', `color=c=black:s=512x512:d=${dur}:r=20`,
      '-vf', filter,
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart+frag_keyframe+empty_moov',
      '-t', String(dur),
      '-f', 'mp4',
      'pipe:1'
    ];

    const ff = spawn('ffmpeg', args);
    const chunks = [];
    const errors = [];
    ff.stdout.on('data', d => chunks.push(d));
    ff.stderr.on('data', e => errors.push(e));
    ff.on('error', reject);
    ff.on('close', code => {
      if (code === 0) return resolve(Buffer.concat(chunks));
      reject(new Error(Buffer.concat(errors).toString() || `ffmpeg exited with code ${code}`));
    });
  });
}
