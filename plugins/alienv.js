const { convertAudio } = require('../Core/audio.js');

module.exports = {
    command: 'alienv',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "asetrate=44100*1.4,atempo=0.8");
    }
};