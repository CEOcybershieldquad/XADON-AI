const { convertAudio } = require('../../Core/audio.js');

module.exports = {
    command: 'fast',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "atempo=1.5");
    }
};