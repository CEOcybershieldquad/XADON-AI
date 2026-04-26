const yts = require('yt-search');
const axios = require('axios');

module.exports = {
    command: 'play1',
    description: '*Musteqeem MD* :Download high quality audio from YouTube',
    category: 'downloader',
    execute: async (sock, m, {
        args,
        text,
        q,
        quoted,
        mime,
        qmsg,
        isMedia,
        groupMetadata,
        groupName,
        participants,
        groupOwner,
        groupAdmins,
        isBotAdmins,
        isAdmins,
        isGroupOwner,
        isCreator,
        prefix,
        reply,
        config,
        sender
    }) => {
        try {
            if (!text) {
                return await reply(`🎵 *Music Downloader*\n\n❌ Please provide a song name!\n📝 Example: ${prefix}play Lilly Alan Walker\n\n⚡ Powered by Queen Riam`);
            }

            // Start processing reaction
            await sock.sendMessage(m.chat, { 
                react: { text: "⏳", key: m.key } 
            });

            const { videos } = await yts(text);
            if (!videos || videos.length === 0) {
                await sock.sendMessage(m.chat, { 
                    react: { text: "🔍", key: m.key } 
                });
                return await reply("🔍 *Search Results*\n\n⚠️ No songs found for your search query!\n💡 Try different keywords");
            }

            const video = videos[0];
            
            // Searching reaction
            await sock.sendMessage(m.chat, { 
                react: { text: "🔍", key: m.key } 
            });

            // Send detailed info
            await sock.sendMessage(m.chat, {
                image: { url: video.thumbnail },
                caption: `🎵 *Track Details*\n\n📀 Title: ${video.title}\n⏱️ Duration: ${video.timestamp}\n👁️ Views: ${video.views}\n📅 Uploaded: ${video.ago}\n\n⬇️ Starting download...\n\n🎶 Powered by XADON`
            }, { quoted: m });

            // Downloading reaction
            await sock.sendMessage(m.chat, { 
                react: { text: "⬇️", key: m.key } 
            });

            const apiUrl = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(video.url)}`;
            const response = await axios.get(apiUrl);
            const data = response.data;

            if (!data?.status || !data.audio) {
                await sock.sendMessage(m.chat, { 
                    react: { text: "❌", key: m.key } 
                });
                return await reply("🚫 *Download Failed*\n\n❌ Could not fetch audio file\n🔧 Please try again in a few minutes");
            }

            // Success reaction
            await sock.sendMessage(m.chat, { 
                react: { text: "🎵", key: m.key } 
            });

            // Send audio with metadata
            await sock.sendMessage(m.chat, {
                audio: { url: data.audio },
                mimetype: "audio/mpeg",
                fileName: `${data.title || video.title}.mp3`.replace(/[<>:"/\\|?*]/g, ''),
                contextInfo: {
                    externalAdReply: {
                        title: "🎵 Download Complete!",
                        body: `Click to play ${data.title || video.title}`,
                        mediaType: 2,
                        thumbnailUrl: video.thumbnail,
                        sourceUrl: video.url
                    }
                }
            }, { quoted: m });

            // Final success reaction
            await sock.sendMessage(m.chat, { 
                react: { text: "✅", key: m.key } 
            });

        } catch (error) {
            console.error('Error in play command:', error);
            await sock.sendMessage(m.chat, { 
                react: { text: "💥", key: m.key } 
            });
            await reply("💥 *Error Occurred*\n\n❌ Something went wrong during download\n🔧 Please try again later");
        }
    }
};