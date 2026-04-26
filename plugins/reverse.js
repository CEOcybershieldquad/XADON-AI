const { convertAudio } = require('../Core/audio.js');

module.exports = {
    command: 'reverse',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "areverse");
    }
};