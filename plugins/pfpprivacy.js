module.exports = {
 command: 'pfpprivacy',
 alias: ['setpfpprivacy', 'profilepicprivacy'],
 description: 'Update who can see your profile picture',
 category: 'privacy',
 usage: '.pfpprivacy <all/contacts/contact_blacklist/none>',

 execute: async (sock, m, { args, reply }) => {
 await sock.sendMessage(m.chat, { react: { text: '🖼️', key: m.key } });

 const setting = args[0]?.toLowerCase();
 const valid = ['all', 'contacts', 'contact_blacklist', 'none'];

 if (!setting ||!valid.includes(setting)) {
 return reply(`֎ ✪ *XADON AI • PFP PRIVACY* ✪ ֎

🌐 Usage:.pfpprivacy <all/contacts/contact_blacklist/none>

Examples:
-.pfpprivacy all
-.pfpprivacy contacts
-.pfpprivacy none

💡 Control who can see your profile picture

> ֎`)
 }

 try {
 await sock.updateProfilePicturePrivacy(setting);
 await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
 return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • PFP PRIVACY UPDATED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Profile picture privacy set to: ${setting}

> ֎`)
 } catch (err) {
 await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
 return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ Failed: ${err.message}

> ֎`)
 }
 }
}