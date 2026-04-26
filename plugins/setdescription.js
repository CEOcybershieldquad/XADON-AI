module.exports = {
  command: 'setdesc',
  alias: ['setdescription'],
  description: 'Set group description',
  category: 'group',
  groupOnly: true,
  adminOnly: true,
  botAdmin: true,
  execute: async (sock, m, { args, reply }) => {
    const desc = args.join(' ');
    if (!desc) return reply('❌ Provide a description!\nExample: .setdesc XADON AI is Live');
    try {
      await sock.groupUpdateDescription(m.chat, desc);
      await reply('✅ Description updated\n> ✨XADON AI');
    } catch (error) {
      await reply('❌ Failed to update description');
    }
  }
};