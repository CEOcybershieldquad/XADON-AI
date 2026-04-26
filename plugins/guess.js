const gameCache = new Map();

module.exports = {
    command: 'guess',
    aliases: ['guessnum', 'guessnumber'],
    category: 'games',
    description: 'Guess the number game (1-100)',
    usage: 'guess <number> or guess start',
    cooldown: 2,
    permissions: ['user'],
    args: true,
    minArgs: 1,

    execute: async (sock, m, { args, reply }) => {
        const input = args[0].toLowerCase();
        const gameKey = `${sender}_${from}`;
        
        if (input === 'start' || input === 'new') {
            const targetNumber = Math.floor(Math.random() * 100) + 1;
            gameCache.set(gameKey, {
                number: targetNumber,
                attempts: 0,
                startTime: Date.now()
            });
            
            return sock.sendMessage(from, {
                text: `🎯 *Number Guessing Game Started!*

🎲 I'm thinking of a number between **1-100**
🎮 Type \`guess <number>\` to make your guess
💡 You have unlimited attempts!

*Example:* guess 50

Good luck! 🍀`
            });
        }
        
        const game = gameCache.get(gameKey);
        if (!game) {
            return sock.sendMessage(from, {
                text: `❌ *No active game*\n\nStart a new game with \`guess start\``
            });
        }
        
        const userGuess = parseInt(args[0]);
        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            return sock.sendMessage(from, {
                text: `❌ *Invalid number*\n\nPlease guess a number between 1-100`
            });
        }
        
        game.attempts++;
        
        if (userGuess === game.number) {
            const timeTaken = ((Date.now() - game.startTime) / 1000).toFixed(1);
            gameCache.delete(gameKey);
            
            let performance;
            if (game.attempts <= 5) performance = "🏆 Excellent!";
            else if (game.attempts <= 10) performance = "👍 Good job!";
            else if (game.attempts <= 15) performance = "👌 Not bad!";
            else performance = "😅 Finally!";
            
            return sock.sendMessage(from, {
                text: `🎉 *CORRECT! You won!*

🎯 **Number:** ${game.number}
🎮 **Attempts:** ${game.attempts}
⏱️ **Time:** ${timeTaken}s
📊 **Performance:** ${performance}

🆕 Type \`guess start\` to play again!`
            });
        }
        
        const hint = userGuess < game.number ? 'higher! ⬆️' : 'lower! ⬇️';
        const response = `🎯 *Guess #${game.attempts}*

❌ **${userGuess}** is wrong!
💡 Try ${hint}

🎮 Keep guessing between 1-100!`;

        await sock.sendMessage(from, { text: response });
    }
};