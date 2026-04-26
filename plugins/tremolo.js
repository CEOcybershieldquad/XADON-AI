const { convertAudio } = require('../Core/audio.js');

module.exports = {
    command: 'tremolo',
    category: 'audio',
    execute: async (sock, m) => {
        await convertAudio(sock, m, "tremolo=f=5:d=0.5");
    }
};