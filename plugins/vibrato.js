const { convertAudio } = require('../Core/audio.js');

module.exports = {
    command: 'vibrato',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "vibrato=f=6.5");
    }
};