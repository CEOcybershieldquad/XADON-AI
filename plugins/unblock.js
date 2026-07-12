module.exports = {
 command: 'unblock',
 alias: ['unblockuser'],
 description: 'Unblock a user',
 category: 'moderation',
 usage: '.unblock <reply|@user|number>',

 execute: async (sock, m, { args, reply }) => {
 await sock.sendMessage(m.chat, { react: { text: '🔓', key: m.key } });

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
 return reply(`֎ ✪ *XADON AI • UNBLOCK* ✪ ֎

🌐 Usage:.unblock <reply|@user|number>

Examples:
-.unblock [reply to message]
-.unblock @user
-.unblock 2348012345678

💡 Unblock someone to message you again

> ֎`)
 }

 try {
 await sock.updateBlockStatus(targetJid, 'unblock');
 await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
 return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • USER UNBLOCKED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Successfully unblocked

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