module.exports = {
  command: 'mute',
  alias: ['silent'],
  description: 'Mute a group',
  category: 'group',
  groupOnly: true,
  adminOnly: true,
  botAdmin: true,
  execute: async (sock, m, { reply }) => {
    try {
      await sock.groupSettingUpdate(m.chat, 'announcement');
      await reply('✅ Group muted\n> 📞XADON AI');
    } catch (error) {
      await reply('❌ Failed to mute group');
    }
  }
};