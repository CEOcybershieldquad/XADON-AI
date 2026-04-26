const { convertAudio } = require('../Core/audio.js');

module.exports = {
    command: 'volume',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "volume=2.0");
    }
};