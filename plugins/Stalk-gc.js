module.exports = {
  command: 'stalkgc',
  alias: ['stalkgroup', 'groupstalk'],
  category: 'group',
  description: 'Get WhatsApp group info from invite link',
  usage: '.stalkgc <group link>',
  execute: async (sock, m, { args, reply }) => {
    const regex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
    const text = args.join(' ');
    if (!text) return msg.reply('📌 Example: .stalkgc (`https://chat.whatsapp.com/xxxxx\n`)                             
    const match = text.match(regex);
    if (!match) return msg.reply('//chat.whatsapp.com/xxxxx\n');
    const match = text.match(regex);
    if (!match) return msg.reply('❌ Invalid link. Format should be:\nhttps://chat.whatsapp.com/xxxxx');
    const code = match[1];
    try {
      const res = await sock.groupGetInviteInfo(code);
      const { subject, subjectOwner, owner, creation, desc, size } = res;
      let result = `📍 *XADON WhatsApp Group Stalk Result:*\n`;
      result += `\n📛 *Name:* ${subject}`;
      result += `\n🧑‍💼 *Owner:* wa.me/${(owner || subjectOwner || '').split('@')[0]}`;
      result += `\n👥 *Member Count:* ${size}`;
      result += `\n⏱️ *Created:* ${new Date(creation * 1000).toLocaleString()}`;
      if (desc) result += `\n📝 *Description:*\n${desc}`;
      result += `\n\n🔗 *Invite Link:*\nhttps://chat.whatsapp.com/${code}`;
      msg.reply(result);
    } catch (e) {
      console.error(e);
      msg.reply('❌ Failed to fetch group info. Ensure link is valid and bot is not blocked by WhatsApp.');
    }
  }
};