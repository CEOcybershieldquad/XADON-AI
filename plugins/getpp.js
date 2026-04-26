const axios = require('axios')

module.exports = {
  command: 'getpp',
  aliases: ['profilepic', 'pp', 'avatar'],
  description: '*Musteqeem MD* :Download tagged user profile picture',
  category: 'tools',

  execute: async (sock, m, { reply }) => {
    try {
      // Check if user tagged someone
      const mentionedJid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
      
      if (mentionedJid.length === 0) {
        return reply('❌ *Please tag the user!*\n\nUsage: .getpp @user\n\nExample: .getpp @234XXX')
      }

      const targetJid = mentionedJid[0]
      const targetNumber = targetJid.split('@')[0]

      // Send processing message
      await sock.sendMessage(m.chat, { 
        text: '⏳ *Fetching profile picture...*' 
      }, { quoted: m })

      let profilePicUrl
      try {
        // Try to get profile picture URL in high quality
        profilePicUrl = await sock.profilePictureUrl(targetJid, 'image')
      } catch (error) {
        // If no profile picture exists
        return reply('❌ *This user has no profile picture!😭*')
      }

      // Download the image
      const response = await axios.get(profilePicUrl, { responseType: 'arraybuffer' })
      const imageBuffer = Buffer.from(response.data, 'binary')

      // Send to your DM (the person who used the command)
      await sock.sendMessage(m.sender, {
        image: imageBuffer,
        caption: `📸 *PROFILE PICTURE*\n\n` +
                 `👤 User: @${targetNumber}\n` +
                 `📱 Number: +${targetNumber}\n` +
                 `⚡ Downloaded by: Musteqeem MD(XADON)\n\n` +
                 `_Profile picture sent to your DM!_`,
        mentions: [targetJid]
      })

      // Confirm in the chat
      await reply(`✅ *Profile picture sent to your DM!*\n\n👤 User: @${targetNumber}`)

    } catch (error) {
      console.error('GetPP Error:', error)
      return reply('❌ *Failed to download profile picture!*\n\n' + 
                   'Possible reasons:\n' +
                   '• User has privacy settings enabled\n' +
                   '• User has no profile picture\n' +
                   '• Network error')
    }
  }
}
