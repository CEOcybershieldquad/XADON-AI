const axios = require('axios');
const yts = require('yt-search');

module.exports = {
    command: 'video2',
    description: 'Download videos from YouTube',
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
                return await reply("❌ Please provide a video name or YouTube link!\nExample: `.video funny cats`");
            }

            // Start processing reaction
            await sock.sendMessage(m.chat, { 
                react: { text: "⏳", key: m.key } 
            });

            let videoUrl = '';
            let videoTitle = '';
            let videoThumbnail = '';

            // Check if input is a URL
            if (text.startsWith('http://') || text.startsWith('https://')) {
                videoUrl = text;
            } else {
                // Search YouTube
                const { videos } = await yts(text);
                if (!videos || videos.length === 0) {
                    await sock.sendMessage(m.chat, { 
                        react: { text: "❌", key: m.key } 
                    });
                    return await reply("⚠️ No videos found for your search!");
                }
                videoUrl = videos[0].url;
                videoTitle = videos[0].title;
                videoThumbnail = videos[0].thumbnail;
            }

            // Validate YouTube URL
            const ytRegex = /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi;
            if (!ytRegex.test(videoUrl)) {
                await sock.sendMessage(m.chat, { 
                    react: { text: "❌", key: m.key } 
                });
                return await reply("🚫 Invalid YouTube link provided!");
            }

            // Downloading reaction
            await sock.sendMessage(m.chat, { 
                react: { text: "⬇️", key: m.key } 
            });

            // Use Hector Manuel's API
            const apiUrl = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
            const response = await axios.get(apiUrl, { headers: { 'Accept': 'application/json' } });

            if (response.status !== 200 || !response.data.status) {
                await sock.sendMessage(m.chat, { 
                    react: { text: "❌", key: m.key } 
                });
                return await reply("🚫 Failed to fetch video from API. Try again later.");
            }

            const data = response.data;
            const title = data.title || videoTitle || 'YouTube Video';
            const thumbnail = data.thumbnail || videoThumbnail;
            const videoDownloadUrl = data.videos["360"];
            const filename = `${title.replace(/[^a-zA-Z0-9-_\.]/g, '_')}.mp4`;

            // Send preview
            await sock.sendMessage(m.chat, {
                image: { url: thumbnail },
                caption: `🎬 *${title}*\n\n⬇️ Downloading video...\n🎥 Quality: 360p\n\n> Powered by XADON`
            }, { quoted: m });

            // Send video
            await sock.sendMessage(m.chat, {
                video: { url: videoDownloadUrl },
                mimetype: 'video/mp4',
                fileName: filename,
                caption: `🎬 *${title}*\n\n✅ Download Complete!\n🎥 Quality: 360p\n\n> XADON AI Video Downloader`
            }, { quoted: m });

            // Success reaction
            await sock.sendMessage(m.chat, { 
                react: { text: "✅", key: m.key } 
            });

        } catch (error) {
            console.error('Error in video command:', error);
            await sock.sendMessage(m.chat, { 
                react: { text: "❌", key: m.key } 
            });
            await reply("❌ Video download failed. Please try again later.");
        }
    }
};