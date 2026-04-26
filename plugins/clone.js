module.exports = {
    command: 'clone',

    execute: async (sock, m, { reply }) => {

        let user = m.mentionedJid[0]

        let pp = await sock.profilePictureUrl(user, 'image')

        await sock.updateProfilePicture(sock.user.id, { url: pp })

        reply('🧬 Profile cloned\n> XADON AI')
    }
}