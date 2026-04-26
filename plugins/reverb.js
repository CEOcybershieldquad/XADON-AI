const { convertAudio } = require('../Core/audio.js');

module.exports = {
    command: 'reverb',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "aecho=0.8:0.88:60:0.4");
    }
};