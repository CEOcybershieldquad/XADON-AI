module.exports = {
  command: 'delete',
  alias: ['del'],
  description: 'Delete a message',
  category: 'tools',
  execute: async (sock, m, { reply }) => {
    try {
      if (!m.quoted) return reply('Reply to a message to delete');
      await sock.sendMessage(m.chat, { delete: m.quoted.key });
    } catch (error) {
      console.error('Delete command error:', error);
      reply(`Error: ${error.message}`);
    }
  }
};