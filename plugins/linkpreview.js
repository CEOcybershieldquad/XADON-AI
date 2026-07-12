module.exports = {
 command: 'linkpreview',
 alias: ['setlinkpreview', 'togglelinkpreview'],
 description: 'Enable or disable link previews',
 category: 'privacy',
 usage: '.linkpreview <on/off>',

 execute: async (sock, m, { args, reply }) => {
 await sock.sendMessage(m.chat, { react: { text: '🔗', key: m.key } });

 const setting = args[0]?.toLowerCase();
 if (!setting ||!['on', 'off'].includes(setting)) {
 return reply(`֎ ✪ *XADON AI • LINK PREVIEW* ✪ ֎

🌐 Usage:.linkpreview <on/off>

Examples:
-.linkpreview on
-.linkpreview off

💡 Toggle link preview generation

> ֎`)
 }

 try {
 await sock.updateDisableLinkPreviewsPrivacy(setting === 'off');
 await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
 return reply(`✦ ───── ⋆⋅☆⋅⋆ ───── ✦
*֎ • LINK PREVIEW UPDATED*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

✅ Link previews: ${setting.toUpperCase()}

> ֎`)
 } catch (err) {
 await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
 return reply(`֎ ✪ *XADON AI • ERROR* ✪ ֎

❌ Failed: ${err.message}

> ֎`)
 }
 }
}