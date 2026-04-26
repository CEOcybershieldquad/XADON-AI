module.exports = {
  command: 'gmailstalk',
  aliase: ['stalkgmail', 'emailstalk'],
  category: 'tools',
  description: 'Get Gmail account info for a given email',
  usage: '.gmailstalk <email>',
  execute: async (sock, m, { args, reply }) => {
    const axios = require('axios');
    const text = args.join(' ');
    if (!text || !text.includes('@')) {
      return msg.reply(`📮 *Example:* ${extra.prefix}${args[0]} example@gmail.com`);
    }
    try {
      const { data } = await axios.get(`https:https://zelapioffciall.vercel.app/stalk/gmailv2?email=${encodeURLComponent(text.trim())} `)
      if (!data.status) {
        return msg.reply('❌ Failed to fetch data. Check the email address.');
      }
      let result = `//zelapioffciall.vercel.app/stalk/gmailv2?email=${encodeURIComponent(text.trim())}`);
      if (!data.status) {
        return msg.reply('❌ Failed to fetch data. Check the email address.');
      }
      let result = `📮 *XADON Gmail Stalking Result*\n\n`;
      result += `📧 Email: ${data.email || '-'}\n`;
      result += `🌐 Domain: ${data.domain || '-'}\n`;
      result += `🏷️ Provider: ${data.provider || '-'}\n\n`;
      result += `🆔 Type: ${data.jenis || '-'}\n`;
      result += `🛠 Created on Gmail: ${data.dibuat_di_gmail ? '✅ Yes' : '❌ No'}\n`;
      result += `🔓 Data Breach: ${data.data_bocor ? '⚠️ Yes' : '✅ No'}\n\n`;
      if (data.data_bocor && Array.isArray(data.breached_services) && data.breached_services.length > 0) {
        result += `🔍 Breached Services:\n`;
        for (let x of data.breached_services) {
          result += `• ${x}\n`;
        }
      } else {
        result += `🔍 Breach Data: -`;
      }
      msg.reply(result.trim());
    } catch (e) {
      console.error(e);
      msg.reply('❌ An error occurred while contacting the API.');
    }
  }
};