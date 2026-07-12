module.exports = {
 command: 'block',
 alias: ['blockuser'],
 description: 'Block a user',
 category: 'moderation',
 usage: '.block <reply|@user|number>',

 execute: async (sock, m, { args, reply }) => {
 await sock.sendMessage(m.chat, { react: { text: '🚫', key: m.key } });

 let targetJid = null;

 if (m.quoted) {
 targetJid = m.quoted.sender || m.quoted.participant || m.quoted.key?.participant;
 } else if (m.mentionedJid?.length) {
 targetJid = m.mentionedJid[0];
 } else if (args[0]) {
 const n = args[0].replace(/[^0-9]/g, '');
 targetJid = `${n}@s.whatsapp.net`;
 }

 if (!targetJid) {
 return reply(`֎ ✪ *XADON AI • BLOCK* ✪ ֎

🌐 Usage:.block <reply|@user|number>

Examples:
-.block [reply to message]
-.block @user
-.block 2348012345678

💡 Block someone from contacting you

> ֎`)
 }

 try {
 await sock.updateBlockStatus(targetJid, 'block');
 await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
 return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • USER BLOCKED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Successfully blocked

❏◦ JID: ${targetJid}

> ֎`)
 } catch (err) {
 await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
 return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ Failed: ${err.message}

> ֎`)
 }
 }
}