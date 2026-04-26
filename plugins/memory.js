const memoryCache = new Map();

module.exports = {
    command: 'memory',
    aliases: ['memorygame', 'remember'],
    category: 'fun',
    description: 'Memory sequence game - remember the pattern',
    usage: 'memory start or memory <sequence>',
    cooldown: 3,
    permissions: ['user'],
    args: true,
    minArgs: 1,

    execute: async (sock, m, { args, reply }) => {
        const input = args[0].toLowerCase();
        const gameKey = `${sender}_${from}`;
        
        if (input === 'start' || input === 'new') {
            const sequence = this.generateSequence(3); // Start with 3 items
            memoryCache.set(gameKey, {
                sequence: sequence,
                level: 1,
                startTime: Date.now()
            });
            
            return sock.sendMessage(from, {
                text: `🧠 *Memory Game Started!*

🎯 **Level 1** - Remember this sequence:

${sequence.join(' ')}

⏰ Study it for 10 seconds...
🎮 Then type \`memory <sequence>\`

*Example:* memory 🟦🟥🟨`
            });
        }
        
        const game = memoryCache.get(gameKey);
        if (!game) {
            return sock.sendMessage(from, {
                text: `❌ *No active memory game*\n\nStart one with \`memory start\``
            });
        }
        
        const userSequence = args.join('').split('');
        const correctSequence = game.sequence;
        
        if (this.arraysEqual(userSequence, correctSequence)) {
            game.level++;
            const newLength = Math.min(3 + game.level, 8); // Max 8 items
            game.sequence = this.generateSequence(newLength);
            
            if (game.level > 5) {
                const timeTaken = ((Date.now() - game.startTime) / 1000).toFixed(1);
                memoryCache.delete(gameKey);
                
                return sock.sendMessage(from, {
                    text: `🏆 *MEMORY MASTER!*

🧠 **Completed:** Level ${game.level - 1}
⏱️ **Total time:** ${timeTaken}s
🎖️ **Rank:** Memory Champion

You have excellent memory skills! 🌟

🆕 Play again: \`memory start\``
                });
            }
            
            return sock.sendMessage(from, {
                text: `✅ *Correct! Level Up!*

🆙 **Level ${game.level}** - New sequence:

${game.sequence.join(' ')}

⏰ Study carefully...
🎮 Type \`memory <sequence>\` when ready

💡 *Tip: The sequence gets longer each level!*`
            });
        } else {
            const timeTaken = ((Date.now() - game.startTime) / 1000).toFixed(1);
            memoryCache.delete(gameKey);
            
            return sock.sendMessage(from, {
                text: `❌ *Game Over!*

🧠 **Your sequence:** ${userSequence.join('')}
✅ **Correct was:** ${correctSequence.join('')}
📊 **Level reached:** ${game.level}
⏱️ **Time played:** ${timeTaken}s

🆕 Try again: \`memory start\``
            });
        }
    },
    
    generateSequence(length) {
        const colors = ['🟦', '🟥', '🟨', '🟩', '🟪', '🟫', '⚫', '⚪'];
        const sequence = [];
        
        for (let i = 0; i < length; i++) {
            sequence.push(colors[Math.floor(Math.random() * colors.length)]);
        }
        
        return sequence;
    },
    
    arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        return arr1.every((val, index) => val === arr2[index]);
    }
};