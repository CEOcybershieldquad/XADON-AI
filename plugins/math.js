const mathCache = new Map();

module.exports = {
    command: 'math',
    aliases: ['mathquiz', 'calculate'],
    category: 'fun',
    description: 'Math challenge game with different difficulty levels',
    usage: 'math <easy/medium/hard> or math <answer>',
    cooldown: 3,
    permissions: ['user'],
    args: true,
    minArgs: 1,

    execute: async (sock, m, { args, reply }) => {
        const input = args[0].toLowerCase();
        const gameKey = `${sender}_${from}`;
        
        if (['easy', 'medium', 'hard'].includes(input)) {
            let problem, answer;
            
            if (input === 'easy') {
                const a = Math.floor(Math.random() * 50) + 1;
                const b = Math.floor(Math.random() * 50) + 1;
                const operations = ['+', '-'];
                const op = operations[Math.floor(Math.random() * operations.length)];
                
                if (op === '+') {
                    problem = `${a} + ${b}`;
                    answer = a + b;
                } else {
                    if (a < b) [a, b] = [b, a]; // Ensure positive result
                    problem = `${a} - ${b}`;
                    answer = a - b;
                }
            } else if (input === 'medium') {
                const a = Math.floor(Math.random() * 20) + 1;
                const b = Math.floor(Math.random() * 12) + 1;
                const operations = ['×', '÷'];
                const op = operations[Math.floor(Math.random() * operations.length)];
                
                if (op === '×') {
                    problem = `${a} × ${b}`;
                    answer = a * b;
                } else {
                    const dividend = a * b; // Ensure clean division
                    problem = `${dividend} ÷ ${a}`;
                    answer = b;
                }
            } else { // hard
                const operations = ['+', '-', '×'];
                const op1 = operations[Math.floor(Math.random() * operations.length)];
                const op2 = operations[Math.floor(Math.random() * operations.length)];
                
                const a = Math.floor(Math.random() * 15) + 1;
                const b = Math.floor(Math.random() * 15) + 1;
                const c = Math.floor(Math.random() * 15) + 1;
                
                problem = `${a} ${op1} ${b} ${op2} ${c}`;
                
                // Calculate with proper order of operations
                let result = a;
                if (op1 === '×') result *= b;
                else if (op1 === '+') result += b;
                else if (op1 === '-') result -= b;
                
                if (op2 === '×') result *= c;
                else if (op2 === '+') result += c;
                else if (op2 === '-') result -= c;
                
                answer = result;
            }
            
            mathCache.set(gameKey, {
                answer: answer,
                difficulty: input,
                startTime: Date.now()
            });
            
            return sock.sendMessage(from, {
                text: `🧮 *Math Challenge - ${input.toUpperCase()}*

❓ **Problem:** ${problem} = ?

🎮 Type \`math <answer>\` to solve
⏱️ You have 60 seconds!

*Example:* math 42`
            });
        }
        
        const game = mathCache.get(gameKey);
        if (!game) {
            return sock.sendMessage(from, {
                text: `❌ *No active math challenge*\n\nStart one with:\n• \`math easy\` - Basic addition/subtraction\n• \`math medium\` - Multiplication/division\n• \`math hard\` - Complex expressions`
            });
        }
        
        const userAnswer = parseInt(args[0]);
        if (isNaN(userAnswer)) {
            return sock.sendMessage(from, {
                text: `❌ *Invalid answer*\n\nPlease enter a number`
            });
        }
        
        const timeTaken = ((Date.now() - game.startTime) / 1000).toFixed(1);
        mathCache.delete(gameKey);
        
        if (userAnswer === game.answer) {
            let points;
            if (game.difficulty === 'easy') points = 10;
            else if (game.difficulty === 'medium') points = 25;
            else points = 50;
            
            let timeBonus = '';
            if (timeTaken < 10) {
                points *= 2;
                timeBonus = '\n⚡ *Speed Bonus: x2 points!*';
            }
            
            return sock.sendMessage(from, {
                text: `🎉 *CORRECT!*

✅ **Answer:** ${game.answer}
⏱️ **Time:** ${timeTaken}s
🏆 **Points:** +${points}${timeBonus}

🆕 Try another: \`math ${game.difficulty}\``
            });
        } else {
            return sock.sendMessage(from, {
                text: `❌ *Wrong Answer*

🔢 **Your answer:** ${userAnswer}
✅ **Correct answer:** ${game.answer}
⏱️ **Time:** ${timeTaken}s

🆕 Try again: \`math ${game.difficulty}\``
            });
        }
    }
};