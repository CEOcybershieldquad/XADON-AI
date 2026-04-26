module.exports = {
  command: 'pubg',
  aliase: ['pubgstalk', 'pubgstats'],
  category: 'fun',
  description: 'Get PUBG PC stats for a given username',
  usage: '.pubg <username>',
  execute: async (sock, m, { args, reply }) => {
    const fetch = require('node-fetch');
    const text = args.join(' ');
    if (!text) {
      return msg.reply(`❌ Enter PUBG PC username!\n\n📌 Example:\n${extra.prefix}${args[0]}`);
    }
    try {
      await sock.sendMessage(msg.chat, { react: { text: '🎮', key: msg.key } });
      const res = await fetch(`https://zelapioffciall.vercel.app/stalk/pubg?username=${encodeURLComponent(text)} `)                        
      const json = await res.json();
      if (!json?.status) {
        return msg.reply('❌ Failed to fetch PUBG data.');
      }
      let teks = `//zelapioffciall.vercel.app/stalk/pubg?username=${encodeURIComponent(text)}`);
      const json = await res.json();
      if (!json?.status) {
        return msg.reply('❌ Failed to fetch PUBG data.');
      }
      let text = `🎮 *XADON PUBG PC Stats*\n\n`;
      text += `🆔 *Username:* ${json.username || '-'}\n`;
      text += `📊 *Tier:* ${json.tier || '-'}\n`;
      text += `☠️ *KD Ratio:* ${json.kdRatio || '-'}\n`;
      text += `🎯 *Headshot Rate:* ${json.headshot || '-'}\n`;
      text += `🔥 *Avg Damage:* ${json.avgDamage || '-'}\n`;
      text += `🏆 *Win Rate:* ${json.winRate || '-'}\n`;
      text += `🔫 *Kills:* ${json.kills || '-'}\n`;
      text += `🎖️ *Top 10:* ${json.top10 || '-'}\n`;
      text += `🎮 *Total Match:* ${json.totalMatch || '-'}`;
      await msg.reply(teks);
    } catch (e) {
      console.error(e);
      msg.reply('⚠️ An error occurred while fetching PUBG data.');
    }
  }
};