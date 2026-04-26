const { convertAudio } = require('../Core/audio.js');

module.exports = {
    command: 'distort',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "acrusher=level_in=1:level_out=1:bits=8:mode=log");
    }
};