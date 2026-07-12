module.exports = {
 command: 'videocall',
 alias: ['vclink', 'vcallme'],
 description: 'Generate a WhatsApp video call link',
 category: 'utility',
 usage: '.videocall',

 execute: async (sock, m, { reply }) => {
 await sock.sendMessage(m.chat, { react: { text: '📹', key: m.key } });

 try {
 const token = await sock.createCallLink('video');
 if (!token) return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ Failed to generate call link

> ֎`);

 const link = `https://call.whatsapp.com/video/${token}`;

 await sock.sendMessage(m.chat, {
 text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • VIDEO CALL LINK*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🌐 ${link}

💡 Anyone with this link can join

> ֎`
 }, { quoted: m });

 await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
 } catch (err) {
 await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
 return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ ${err.message}

> ֎`)
 }
 }
}