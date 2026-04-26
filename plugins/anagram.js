const WORDS = [
    'listen', 'triangle', 'funeral', 'dormitory', 'the eyes',
    'debit card', 'astronomer', 'the classroom', 'election results',
    'silent', 'integral', 'real fun', 'dirty room', 'they see',
    'bad credit', 'moon starer', 'schoolmaster', 'lies',
    'conversation', 'desperation', 'masterpiece', 'documentary',
    'earthquakes', 'vacation time', 'parenthood', 'statue of liberty',
    'a gentleman', 'eleven plus two', 'twelve plus one', 'dormitory',
    'slot machines', 'cash lost in me', 'the morse code', 'here come dots',
    'astronomers', 'moon starers', 'desperation', 'a rope ends it',
    'angered', 'enraged', 'elbow', 'below', 'night', 'thing',
    'presbyterian', 'best in prayer', 'a decimal point', 'im a dot in place',
    'television', 'listen', 'the countryside', 'no city dust here',
    'violence', 'nice love', 'slot machines', 'cash lost in me',
    'snooze alarms', 'alas no more z\'s', 'dormitory', 'dirty room'
];

function shuffleWord(word) {
    const letters = word.replace(/[^a-zA-Z]/g, '').split('');
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
}

module.exports = {
    command: 'anagram',
    alias: ['scramble', 'unscramble', 'wordmix', 'anag'],
    description: 'Guess the original word from scrambled letters',
    category: 'fun',
    usage: '.anagram',

    execute: async (sock, m, { reply }) => {
        await sock.sendMessage(m.chat, { react: { text: '🔤', key: m.key } });

        const index = Math.floor(Math.random() * WORDS.length);
        const answer = WORDS[index];
        let scrambled = shuffleWord(answer);

        // Make sure scrambled!= original
        while (scrambled.toLowerCase() === answer.replace(/[^a-zA-Z]/g, '').toLowerCase()) {
            scrambled = shuffleWord(answer);
        }

        const letterCount = answer.replace(/[^a-zA-Z]/g, '').length;

        const gameText = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • ANAGRAM CHALLENGE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

🔤 Scrambled: ${scrambled.toUpperCase()}
📝 Letters: ${letterCount}

💡 Reply with your guess
💡 Use.hint to see answer
💡 Use.anagram for new word

> ֎`;

        await sock.sendMessage(m.chat, {
            text: gameText
        }, { quoted: m });

        if (!global.anagramAnswers) global.anagramAnswers = {};
        global.anagramAnswers[m.chat] = {
            answer: answer.toLowerCase(),
            attempts: 0
        };

        await sock.sendMessage(m.chat, { react: { text: '🎭', key: m.key } });
    }
};