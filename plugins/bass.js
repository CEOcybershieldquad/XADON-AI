const { convertAudio } = require('../Core/audio.js');

module.exports = {
    command: 'bass',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "bass=g=15");
    }
};