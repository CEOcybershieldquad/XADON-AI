module.exports = {
 command: 'callsprivacy',
 alias: ['setcallsprivacy', 'whocancall'],
 description: 'Update who can call you',
 category: 'privacy',
 usage: '.callsprivacy <all/known>',

 execute: async (sock, m, { args, reply }) => {
 await sock.sendMessage(m.chat, { react: { text: '📞', key: m.key } });

 const setting = args[0]?.toLowerCase();
 const valid = ['all', 'known'];

 if (!setting ||!valid.includes(setting)) {
 return reply(`֎ ✪ *XADON AI • CALL PRIVACY* ✪ ֎

🌐 Usage:.callsprivacy <all/known>

Examples:
-.callsprivacy all
-.callsprivacy known

💡 • all = Everyone
💡 • known = Contacts only

> ֎`)
 }

 try {
 await sock.updateCallPrivacy(setting);
 await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
 return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • CALL PRIVACY UPDATED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Call privacy set to: ${setting}

> ֎`)
 } catch (err) {
 await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
 return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ Failed: ${err.message}

> ֎`)
 }
 }
}