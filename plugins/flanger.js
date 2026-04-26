const { convertAudio } = require('../Core/audio.js');

module.exports = {
    command: 'flanger',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "flanger");
    }
};