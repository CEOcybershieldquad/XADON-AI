const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'list',
  description: '*Musteqeem MD* :List all available bot commands',
  category: 'owner',
  owner: false, // set to true if you want owner-only

  execute: async (sock, m, { reply }) => {
    try {
      const pluginsDir = path.join(__dirname, '..', 'plugins');
      const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'));

      let listText = '📜 *Available Commands by XADON:*\n\n';

      for (const file of files) {
        const pluginPath = path.join(pluginsDir, file);
        try {
          const plugin = require(pluginPath);
          const cmd = plugin.command || file.replace('.js', '');
          const desc = plugin.description || 'No description';
          listText += `• *${cmd}* — ${desc}\n`;
        } catch (err) {
          listText += `• ⚠ ${file} — Failed to load\n`;
        }
      }

      await reply(listText);
    } catch (err) {
      await reply(`✘ Failed to list commands:\n${err}`);
    }
  }
};
