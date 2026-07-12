module.exports = {
 command: 'messagesprivacy',
 alias: ['setmsgprivacy', 'msgprivacy'],
 description: 'Update who can send you messages',
 category: 'privacy',
 usage: '.messagesprivacy <all/contacts/contact_blacklist/none>',

 execute: async (sock, m, { args, reply }) => {
 await sock.sendMessage(m.chat, { react: { text: '💬', key: m.key } });

 const setting = args[0]?.toLowerCase();
 const valid = ['all', 'contacts', 'contact_blacklist', 'none'];

 if (!setting ||!valid.includes(setting)) {
 return reply(`֎ ✪ *XADON AI • MESSAGES PRIVACY* ✪ ֎

🌐 Usage:.messagesprivacy <all/contacts/contact_blacklist/none>

Examples:
-.messagesprivacy all
-.messagesprivacy contacts
-.messagesprivacy none

💡 Control who can message you

> ֎`)
 }

 try {
 await sock.updateMessagesPrivacy(setting);
 await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
 return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • MESSAGES PRIVACY UPDATED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Messages privacy set to: ${setting}

> ֎`)
 } catch (err) {
 await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
 return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ Failed: ${err.message}

> ֎`)
 }
 }
}