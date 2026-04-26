const { convertAudio } = require('../../Core/audio.js');

module.exports = {
    command: 'robot',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "afftfilt=real='hypot(re,im)':imag='0'");
    }
};