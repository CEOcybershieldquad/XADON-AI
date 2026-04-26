const { convertAudio } = require('../Core/audio.js');

module.exports = {
    command: 'phaser',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "aphaser=in_gain=0.4");
    }
};