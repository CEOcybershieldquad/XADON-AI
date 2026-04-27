module.exports = {
 command: 'delgc',
 alias: ['deletegc', 'dgc', 'groupdelete', 'kickall'],
 description: 'Delete group chat by kicking everyone and leaving (DANGEROUS)',
 category: 'owner',
 usage: '.delgc',
 owner: true,

 execute: async (sock, m, { reply, isOwner }) => {

 if (!m.isGroup)
 return reply('❌ This command works only in groups\n> XADON AI');

 const chatId = m.chat;

 await sock.sendMessage(m.chat, {
 react: { text: "☠️", key: m.key }
 });

 try {

 // Send warning notice
 await sock.sendMessage(m.chat, {
 text: `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
 *XADON AI • DELETE GROUP*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

⚠️ WARNING: This will kick EVERYONE and delete the group!

Starting in 10 seconds...
Use *.restart* to stop the process.

> XADON AI`
 });

 // Wait 10 seconds
 await new Promise(r => setTimeout(r, 10000));

 // Get fresh metadata
 const freshMeta = await sock.groupMetadata(chatId);
 const participants = freshMeta.participants;

 // Kick all other participants except bot
 const toRemove = participants
 .filter(p => p.id!== sock.user.id && p.admin!== 'superadmin')
 .map(p => p.id);

 if (toRemove.length > 0) {
 await sock.groupParticipantsUpdate(chatId, toRemove, 'remove');
 await new Promise(r => setTimeout(r, 2000)); // Wait for WhatsApp to process
 }

 await sock.sendMessage(m.chat, {
 text: `_*🗑️ Kicked ${toRemove.length} members. Leaving group...*_\n\n> XADON AI`
 });

 // Bot leaves the group
 await sock.groupLeave(chatId);
 console.log(`[DELGC SUCCESS] Bot left group ${chatId}`);

 } catch (err) {

 console.error('[DELGC ERROR]', err?.message || err);

 await sock.sendMessage(m.chat, {
 react: { text: "❌", key: m.key }
 });

 let msg = '❌ Failed to delete group\n\n';

 if (err.message?.includes('not-authorized') || err.message?.includes('admin')) {
 msg += '• Bot is not admin or lacks permission';
 } else if (err.message?.includes('rate')) {
 msg += '• Rate limit - WhatsApp blocked the action. Try again later';
 } else {
 msg += `• ${err.message || 'Unknown error'}`;
 }

 reply(msg + '\n> XADON AI');
 }
 }
};