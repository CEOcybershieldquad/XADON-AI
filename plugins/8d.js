const { convertAudio } = require('../Core/audio.js');

module.exports = {
    command: '8d',
    alias: [],
    category: 'audio',
    description: 'Convert audio to 8D',

    execute: async (sock, m) => {

        await convertAudio(sock, m,
            "apulsator=hz=0.12:amount=0.9"
        );

    }
};