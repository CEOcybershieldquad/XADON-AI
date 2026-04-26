const { convertAudio } = require('../Core/audio.js');

module.exports = {
    command: 'radio',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "highpass=f=300, lowpass=f=3000");
    }
};