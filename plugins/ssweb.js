const APIs = require('../../utils/api');

module.exports = {
  command: 'ssweb',
  aliases: ['screenshot', 'ss', 'webss'],
  category: 'media',
  description: 'Take a screenshot of a website',
  usage: '.ssweb <url>',
  
  execute: async (sock, m, { args, reply }) => {
    try {
      if (args.length === 0) {
        return extra.reply('❌ Please provide a website URL!\n\nExample: .ssweb https://WhatsApp.com');
      }
      
      const url = args.join(' ');
      
      // Validate URL
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return extra.reply('❌ Please provide a valid URL starting with http:// or https://');
      }
      
      await sock.sendMessage(extra.from, {
        react: { text: '📥', key: msg.key }
      });
      
      const screenshotBuffer = await APIs.screenshotWebsite(url);
      
      await sock.sendMessage(extra.from, {
        image: screenshotBuffer,
      }, { quoted: msg });
      
    } catch (error) {
      console.error('SSWeb command error:', error);
      await extra.reply(`❌ Failed to screenshot website: ${error.message}`);
    }
  }
};

