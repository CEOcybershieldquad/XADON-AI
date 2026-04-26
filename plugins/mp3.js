module.exports = {
    command: 'tomp3',
    aliases: ['mp3', 'audio', 'toaudio'],
    category: 'media',
    description: 'Convert video/audio/sticker voice note to MP3',
    usage: '.tomp3 (reply to video/audio/voice note)',

    execute: async (sock, m, { args, reply }) => {
        try {
            let quoted = m.quoted?.message;
            let mediaMsg;

            if (quoted?.audioMessage || quoted?.videoMessage || quoted?.pttMessage) {
                mediaMsg = m.quoted;
            } else if (m.message?.audioMessage || m.message?.videoMessage) {
                mediaMsg = m;
            } else {
                return extra.reply("Reply to a video, audio, or voice note with .tomp3");
            }

            await sock.sendMessage(m.chat, { react: { text: "🎵", key: m.key } });

            const buffer = await sock.downloadMediaMessage(mediaMsg);

            await sock.sendMessage(m.chat, {
                audio: buffer,
                mimetype: 'audio/mp4', // or 'audio/mpeg' depending on your ffmpeg setup
                ptt: false,
                fileName: 'converted.mp3',
                caption: "Converted to MP3 🎧"
            }, { quoted: m });

        } catch (err) {
            console.error('tomp3 error:', err);
            await extra.reply("Failed to convert to MP3 😔\n(Make sure bot has ffmpeg if needed)");
        }
    }
};