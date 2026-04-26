module.exports = {
  command: 'unmute',
  alias: ['um'],
  description: 'Unmute a group',
  category: 'group',
  execute: async (sock, m, { args, reply }) => {
    try {
      if (!m.isGroup) return reply('This command can only be used in a group!');

      await sock.groupSettingUpdate(m.chat, 'not_announcement');
      const response = 'Group has been unmuted!\n> 🧭XADON AI💫';
      reply(response);
    } catch (error) {
      console.error('Error unmuting group:', error);
      reply(`Error unmuting group: ${error.message}`);
    }
  }
};