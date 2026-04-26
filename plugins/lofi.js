const { convertAudio } = require('../Core/audio.js');

module.exports = {
    command: 'lofi',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "lowpass=f=3000");
    }
};