const games = new Map();

function createBoard() {
    return [
        ['1️⃣', '2️⃣', '3️⃣'],
        ['4️⃣', '5️⃣', '6️⃣'],
        ['7️⃣', '8️⃣', '9️⃣']
    ];
}

function checkWinner(board) {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) return board[i][0];
    }
    for (let i = 0; i < 3; i++) {
        if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) return board[0][i];
    }
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) return board[0][0];
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) return board[0][2];
    return null;
}

function isDraw(board) {
    return board.every(row => row.every(cell => cell === '❌' || cell === '⭕'));
}

function posToCoords(pos) {
    return { row: Math.floor((pos - 1) / 3), col: (pos - 1) % 3 };
}

function formatBoard(board) {
    return board.map((row, i) => `${row.join(' │ ')}`).join('\n');
}

// Shared move handler
async function handleMove(sock, m, game, position, reply, prefix, chatId, userId) {
    if (userId!== game.currentPlayer) {
        return reply('❌ It\'s not your turn!\n> ֎');
    }

    const { row, col } = posToCoords(position);

    if (game.board[row][col] === '❌' || game.board[row][col] === '⭕') {
        return reply('❌ That spot is already taken!\n> ֎');
    }

    const mark = userId === game.playerX? '❌' : '⭕';
    game.board[row][col] = mark;
    game.moves++;
    game.currentPlayer = game.currentPlayer === game.playerX? game.playerO : game.playerX;

    const winner = checkWinner(game.board);
    const draw =!winner && isDraw(game.board);

    let status = '';
    let reactEmoji = '🎭';

    if (winner) {
        const winnerJid = winner === '❌'? game.playerX : game.playerO;
        status = `🎉 @${winnerJid.split('@')[0]} WINS!`;
        reactEmoji = '🎉';
    } else if (draw) {
        status = '🤝 DRAW!';
        reactEmoji = '🤝';
    } else {
        status = `⏳ ${game.currentPlayer === game.playerX? '❌' : '⭕'}'s turn`;
    }

    await sock.sendMessage(m.chat, { react: { text: reactEmoji, key: m.key } });

    const gameText = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • TIC-TAC-TOE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

👤 ❌ (X): @${game.playerX.split('@')[0]}
👤 ⭕ (O): @${game.playerO.split('@')[0]}

📊 Status: ${status}

🎯 Board:
${formatBoard(game.board)}

📊 Moves: ${game.moves}

${winner || draw? `💡 Play again:.ttt start @user` : `💡 Reply with 1-9 to play`}

> ֎`;

    const sent = await sock.sendMessage(m.chat, {
        text: gameText,
        mentions: [game.playerX, game.playerO]
    }, { quoted: m });

    if (winner || draw) {
        games.delete(chatId);
    } else {
        game.messageId = sent.key.id;
        games.set(chatId, game);
    }
}

// Pre-command handler for reply-to-play
async function handleGameReply(sock, m) {
    const chatId = m.chat;
    const userId = m.sender;
    const game = games.get(chatId);

    if (!game) return false;
    if (userId!== game.playerX && userId!== game.playerO) return false;

    const quotedId = m.message?.extendedTextMessage?.contextInfo?.stanzaId;
    if (!quotedId || quotedId!== game.messageId) return false;

    const text = m.text?.trim() || '';
    const pos = parseInt(text);
    if (isNaN(pos) || pos < 1 || pos > 9) return false;

    const mockReply = async (txt) => {
        await sock.sendMessage(chatId, { text: txt }, { quoted: m });
    };

    await handleMove(sock, m, game, pos, mockReply, '.', chatId, userId);
    return true;
}

module.exports = {
    command: 'ttt',
    alias: ['tictactoe', 'xo'],
    description: 'Play Tic-Tac-Toe with a friend',
    category: 'fun',
    usage: '.ttt start @opponent |.ttt <1-9> |.ttt stop',

    handleGameReply,

    execute: async (sock, m, { args, reply, prefix }) => {
        const sub = args[0]?.toLowerCase();
        const chatId = m.chat;
        const userId = m.sender;

        if (!sub) {
            const game = games.get(chatId);
            return reply(`֎ ✪ *XADON AI • TIC-TAC-TOE* ✪ ֎

${game? '🎮 Game in progress' : '🟢 Ready to play'}

Commands:
-.ttt start @user
-.ttt <1-9>
-.ttt stop

🎮 Challenge a friend

> ֎`);
        }

        if (sub === 'start') {
            let opponent = null;
            if (m.quoted?.sender) opponent = m.quoted.sender;
            if (!opponent && m.mentionedJid?.length) opponent = m.mentionedJid[0];
            if (!opponent) {
                for (const arg of args.slice(1)) {
                    const num = arg.replace(/[^0-9]/g, '');
                    if (num.length >= 7) { opponent = num + '@s.whatsapp.net'; break; }
                }
            }

            if (!opponent)
                return reply('❌ Tag the person you want to play with\n\nExample:.ttt start @user\n\n> ֎');
            if (opponent === userId)
                return reply('❌ You cannot play against yourself\n> ֎');
            if (games.has(chatId))
                return reply('❌ A game is already in progress\n\nUse.ttt stop first\n\n> ֎');

            const first = Math.random() < 0.5? userId : opponent;

            const game = {
                board: createBoard(),
                playerX: first,
                playerO: first === userId? opponent : userId,
                currentPlayer: first,
                moves: 0
            };

            games.set(chatId, game);

            await sock.sendMessage(m.chat, { react: { text: '🎮', key: m.key } });

            const gameText = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
    *֎ • TIC-TAC-TOE*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

👤 ❌ (X): @${first.split('@')[0]} ${first === userId? '(You)' : ''}
👤 ⭕ (O): @${first === userId? opponent.split('@')[0] : userId.split('@')[0]}

🎯 First: ${first === userId? 'You' : 'Opponent'} go first ❌

🎯 Board:
1️⃣ │ 2️⃣ │ 3️⃣
4️⃣ │ 5️⃣ │ 6️⃣
7️⃣ │ 8️⃣ │ 9️⃣

💡 Reply with 1-9 to play

> ֎`;

            const sent = await sock.sendMessage(m.chat, {
                text: gameText,
                mentions: [userId, opponent]
            }, { quoted: m });

            game.messageId = sent.key.id;
            games.set(chatId, game);
            return;
        }

        if (sub === 'stop') {
            if (!games.has(chatId))
                return reply('❌ No active game\n> ֎');
            games.delete(chatId);
            await sock.sendMessage(m.chat, { react: { text: '🛑', key: m.key } });
            return reply('🛑 Game stopped\n> ֎');
        }

        const game = games.get(chatId);
        if (!game)
            return reply(`❌ No active game\n\nUse ${prefix}ttt start @user\n\n> ֎`);

        const position = parseInt(sub);
        if (isNaN(position) || position < 1 || position > 9) {
            return reply('❌ Choose a position 1-9\n> ֎');
        }

        return await handleMove(sock, m, game, position, reply, prefix, chatId, userId);
    }
};