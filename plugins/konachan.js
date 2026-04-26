const sharp = require('sharp');
// Required for groupStatus to work
const { proto } = require('@crysnovax/baileys-stable');

module.exports = {
 command: 'gstatus',
 alias: ['groupstatus', 'gs'],
 description: 'Post a status to the group - shows as story ring on group icon',
 category: 'admin',
 usage: '.gstatus <text> | Reply to image/video + .gstatus',

 execute: async (sock, m, { args, text, reply }) => {
 try {
 const quoted = m.quoted;
 const chat = m.chat;

 await sock.sendMessage(m.chat, { react: { text: '📸', key: m.key } });

 // ── Image status ──────────────────────────────────
 if (quoted && /image|webp/.test(quoted.mimetype || '')) {
 let media = await quoted.download();
 if (!media || media.length === 0) {
 await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
 return reply('❌ Failed to download image\n\n> ֎');
 }

 // Upscale + max quality to fight WhatsApp compression
 try {
 media = await sharp(media)
 .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: false })
 .jpeg({ quality: 100, chromaSubsampling: '4:4:4' })
 .toBuffer();
 } catch (e) {
 console.log('[GSTATUS] Sharp skipped:', e.message);
 }

 await sock.sendMessage(chat, {
 image: media,
 caption: text || '',
 groupStatus: true // Only works on @crysnovax/baileys-stable
 });

 await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
 return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
 *֎ • GROUP STATUS*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📸 Image status posted
👥 Visible on group icon ring

> ֎`);
 }

 // ── Video status ──────────────────────────────────
 if (quoted && /video/.test(quoted.mimetype || '')) {
 let media = await quoted.download();
 if (!media || media.length === 0) {
 await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
 return reply('❌ Failed to download video\n\n> ֎');
 }

 await sock.sendMessage(chat, {
 video: media,
 caption: text || '',
 groupStatus: true
 });

 await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
 return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
 *֎ • GROUP STATUS*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🎥 Video status posted
👥 Visible on group icon ring

> ֎`);
 }

 // ── Text status ───────────────────────────────────
 if (text) {
 await sock.sendMessage(chat, {
 text: text,
 groupStatus: true
 });

 await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
 return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
 *֎ • GROUP STATUS*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📝 Text status posted
👥 Visible on group icon ring

> ֎`);
 }

 // Help message
 reply(`֎ ✪ *XADON AI • GROUP STATUS* ✪ ֎

📸 Usage:
- .gstatus <text>
- Reply to image + .gstatus <caption>
- Reply to video + .gstatus <caption>

💡 Posts status visible on group icon
⚠️ Admin only | Requires @crysnovax/baileys-stable

> ֎`);

 } catch (err) {

 console.error('[GSTATUS ERROR]', err?.message || err);

 await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

 let msg = '❌ Failed to post group status\n\n';

 if (err.message?.includes('groupStatus')) {
 msg += '• Requires @crysnovax/baileys-stable\n• Update your baileys fork';
 } else if (err.message?.includes('admin')) {
 msg += '• Bot must be admin to post status';
 } else if (err.message?.includes('not-authorized')) {
 msg += '• Missing admin permissions';
 } else {
 msg += '• ' + err.message;
 }

 reply(msg + '\n\n> ֎');
 }
 }
};