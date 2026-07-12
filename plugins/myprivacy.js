module.exports = {
 command: 'myprivacy',
 alias: ['privacysettings', 'viewprivacy'],
 description: 'View all your current privacy settings',
 category: 'privacy',
 usage: '.myprivacy',

 execute: async (sock, m, { reply }) => {
 await sock.sendMessage(m.chat, { react: { text: '🔒', key: m.key } });

 try {
 const s = await sock.fetchPrivacySettings(true);

 if (!s) return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ Could not fetch privacy settings

> ֎`);

 await sock.sendMessage(m.chat, {
 text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • YOUR PRIVACY SETTINGS*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

👁️ Last Seen : ${s.last || 'N/A'}
🟢 Online : ${s.online || 'N/A'}
🖼️ Profile Pic : ${s.profile || 'N/A'}
📱 Status : ${s.status || 'N/A'}
👥 Groups Add : ${s.groupadd || 'N/A'}
📞 Calls : ${s.calladd || 'N/A'}
💬 Messages : ${s.messages || 'N/A'}
💙 Read Receipts: ${s.readreceipts || 'N/A'}

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