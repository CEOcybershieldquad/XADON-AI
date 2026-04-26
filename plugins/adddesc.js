module.exports = {
  command: 'adddesc',
  alias: ['appenddesc'],
  description: 'Add to group description without removing existing one',
  category: 'group',
  groupOnly: true,
  adminOnly: true,
  botAdmin: true,

  execute: async (sock, m, { args, reply }) => {

    const newText = args.join(' ');
    if (!newText)
      return reply('❌ Provide text to add!\nExample: .adddesc Welcome to XADON AI');

    try {

      // 📥 Get current group description
      const metadata = await sock.groupMetadata(m.chat);
      const currentDesc = metadata.desc || '';

      // ➕ Append new text
      const updatedDesc = currentDesc
        ? `${currentDesc}\n\n${newText}`
        : newText;

      // 🚀 Update description
      await sock.groupUpdateDescription(m.chat, updatedDesc);

      await reply(`✨ *XADON AI • DESCRIPTION UPDATE*

➕ Successfully added to description

📝 Added:
${newText}

> XADON AI ⚡`);

    } catch (error) {

      console.error('[ADDDESC ERROR]', error);

      await reply(`❌ Failed to update description

> ${error.message}
> XADON AI`);
    }
  }
};