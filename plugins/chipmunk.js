const { convertAudio } = require('../../Core/audio.js');

module.exports = {
    command: 'chipmunk',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "asetrate=44100*1.5");
    }
};