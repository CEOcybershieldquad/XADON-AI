const { convertAudio } = require('../Core/audio.js');

module.exports = {
    command: 'deep',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "asetrate=44100*0.7");
    }
};