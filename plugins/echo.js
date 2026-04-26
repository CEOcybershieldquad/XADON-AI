const { convertAudio } = require('../Core/audio.js');

module.exports = {
    command: 'echo',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "aecho=0.8:0.9:1000:0.3");
    }
};