module.exports = {
 command: 'groupprivacy',
 alias: ['setgroupprivacy', 'whocanadd', 'groupadd'],
 description: 'Update who can add you to groups',
 category: 'privacy',
 usage: '.groupprivacy <all/contacts/contact_blacklist/none>',

 execute: async (sock, m, { args, reply }) => {
 await sock.sendMessage(m.chat, { react: { text: '👥', key: m.key } });

 const setting = args[0]?.toLowerCase();
 const valid = ['all', 'contacts', 'contact_blacklist', 'none'];

 if (!setting ||!valid.includes(setting)) {
 return reply(`֎ ✪ *XADON AI • GROUP PRIVACY* ✪ ֎

🌐 Usage:.groupprivacy <all/contacts/contact_blacklist/none>

Examples:
-.groupprivacy all
-.groupprivacy contacts
-.groupprivacy none

💡 Control who can add you to groups

> ֎`)
 }

 try {
 await sock.updateGroupsAddPrivacy(setting);
 await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
 return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • GROUP PRIVACY UPDATED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Groups add privacy set to: ${setting}

> ֎`)
 } catch (err) {
 await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
 return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ Failed: ${err.message}

> ֎`)
 }
 }
}