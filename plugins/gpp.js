const axios = require('axios')

module.exports = {
  command: 'gpp',
  aliases: ['grouppp', 'grouppic', 'groupavatar'],
  description: '*Musteqeem MD* :Download group profile picture',
  category: 'group',
  group: true, // Only works in groups

  execute: async (sock, m, { reply, groupMetadata }) => {
    try {
      // Check if used in a group
      if (!m.isGroup) {
        return reply('❌ *This command only works in groups!*')
      }

      const groupJid = m.chat
      const groupName = groupMetadata?.subject || 'Unknown Group'

      // Send processing message
      await sock.sendMessage(m.chat, { 
        text: '⏳ *Fetching group profile picture...*' 
      }, { quoted: m })

      let profilePicUrl
      try {
        // Try to get group profile picture URL in high quality
        profilePicUrl = await sock.profilePictureUrl(groupJid, 'image')
      } catch (error) {
        // If no profile picture exists
        return reply('❌ *This group has no profile picture!*')
      }

      // Download the image
      const response = await axios.get(profilePicUrl, { responseType: 'arraybuffer' })
      const imageBuffer = Buffer.from(response.data, 'binary')

      // Send to your DM (the person who used the command)
      await sock.sendMessage(m.sender, {
        image: imageBuffer,
        caption: `📸 *GROUP PROFILE PICTURE*\n\n` +
                 `👥 Group: ${groupName}\n` +
                 `🆔 ID: ${groupJid.split('@')[0]}\n` +
                 `⚡ Downloaded by: XADON\n\n` +
                 `_Group picture sent to your DM!_`
      })

      // Confirm in the group
      await reply(`✅ *Group profile picture sent to your DM!*\n\n👥 Group: *${groupName}*`)

    } catch (error) {
      console.error('GPP Error:', error)
      return reply('❌ *Failed to download group profile picture!*\n\n' +
                   'Possible reasons:\n' +
                   '• Group has no profile picture\n' +
                   '• Network error\n' +
                   '• Bot lacks permissions')
    }
  }
}
