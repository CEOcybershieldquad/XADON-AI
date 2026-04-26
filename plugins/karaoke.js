const { convertAudio } = require('../Core/audio.js');

module.exports = {
    command: 'karaoke',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "pan=stereo|c0=c0|c1=-1*c1");
    }
};