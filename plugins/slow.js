const { convertAudio } = require('../../Core/audio.js');

module.exports = {
    command: 'slow',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "atempo=0.7");
    }
};