module.exports = {
 command: 'lastseen',
 alias: ['setlastseen', 'lastseenprivacy'],
 description: 'Update who can see your last seen',
 category: 'privacy',
 usage: '.lastseen <all/contacts/contact_blacklist/none>',

 execute: async (sock, m, { args, reply }) => {
 await sock.sendMessage(m.chat, { react: { text: '👁️', key: m.key } });

 const setting = args[0]?.toLowerCase();
 const valid = ['all', 'contacts', 'contact_blacklist', 'none'];

 if (!setting ||!valid.includes(setting)) {
 return reply(`֎ ✪ *XADON AI • LAST SEEN* ✪ ֎

🌐 Usage:.lastseen <all/contacts/contact_blacklist/none>

Examples:
-.lastseen all
-.lastseen contacts
-.lastseen none

💡 Control who can see when you were last online

> ֎`)
 }

 try {
 await sock.updateLastSeenPrivacy(setting);
 await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
 return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • LAST SEEN UPDATED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Last seen set to: ${setting}

> ֎`)
 } catch (err) {
 await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
 return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ Failed: ${err.message}

> ֎`)
 }
 }
}