const { convertAudio } = require('../Core/audio.js');

module.exports = {
    command: 'nightcore',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "asetrate=44100*1.25,atempo=1.1");
    }
};