// commands/game/chess.js
// .chess start     → start a new game
// .chess e2e4      → make a move
// .chess board     → show current board
// .chess resign    → resign the game

const { Chess } = require('chess.js'); // npm install chess.js

// Global storage for active games
global.chessGames = global.chessGames || new Map();

module.exports = {
    command: 'chess',
    aliases: ['ch', 'chessgame'],
    description: 'Play Chess in group (2 players)',
    category: 'fun',

    execute: async (sock, m, { args, text }) => {
        const chat = m.chat;
        let game = global.chessGames.get(chat);

        // ── START NEW GAME ─────────────────────────────────────
        if (args[0] === 'start' || args[0] === 'new') {
            if (game) return reply("A chess game is already running in this chat!");

            game = {
                chess: new Chess(),
                white: m.sender,
                black: null,
                started: Date.now()
            };

            global.chessGames.set(chat, game);

            const startMsg = `✦ ───── ⋆⋅♟️⋅⋆ ───── ✦
       *XADON CHESS v1.0*
✦ ───── ⋆⋅♟️⋅⋆ ───── ✦

White (🔴): @${m.sender.split('@')[0]}
Black (🔵): Waiting for opponent...

Reply with .chess start to join as Black

Current board:

${game.chess.board().map(row => row.map(p => p ? p : '·').join(' ')).join('\n')}

Type your move like: .chess e2e4`;

            return sock.sendMessage(m.chat, { text: startMsg, mentions: [m.sender] }, { quoted: m });
        }

        if (!game) return reply("No active chess game. Start one with `.chess start`");

        // ── JOIN AS BLACK ─────────────────────────────────────
        if (args[0] === 'start' && !game.black) {
            if (m.sender === game.white) return reply("You are already White!");

            game.black = m.sender;
            const startMsg = `✦ ───── ⋆⋅♟️⋅⋆ ───── ✦
       *CHESS GAME STARTED*
✦ ───── ⋆⋅♟️⋅⋆ ───── ✦

White (🔴): @${game.white.split('@')[0]}
Black (🔵): @${game.black.split('@')[0]}

It's White's turn!

${renderBoard(game.chess)}`;

            return sock.sendMessage(m.chat, { text: startMsg, mentions: [game.white, game.black] }, { quoted: m });
        }

        // ── MAKE A MOVE ───────────────────────────────────────
        const move = args[0];
        if (!move || move.length < 4) {
            return sock.sendMessage(m.chat, { text: renderBoard(game.chess) }, { quoted: m });
        }

        const playerColor = m.sender === game.white ? 'w' : 'b';
        if (game.chess.turn() !== playerColor) {
            return reply("It's not your turn!");
        }

        try {
            const result = game.chess.move(move, { sloppy: true });

            if (!result) return reply("Illegal move! Try again.");

            // Check game end
            let status = "";
            if (game.chess.isCheckmate()) {
                status = `CHECKMATE! ${playerColor === 'w' ? 'White' : 'Black'} wins! 🎉`;
                global.chessGames.delete(chat);
            } else if (game.chess.isDraw()) {
                status = "DRAW! Game over.";
                global.chessGames.delete(chat);
            }

            const boardMsg = `✦ ───── ⋆⋅♟️⋅⋆ ───── ✦
       *XADON CHESS*
✦ ───── ⋆⋅♟️⋅⋆ ───── ✦

${renderBoard(game.chess)}

\( {status || ` \){game.chess.turn() === 'w' ? '🔴 White' : '🔵 Black'}'s turn`}

Last move: ${move}`;

            await sock.sendMessage(m.chat, { text: boardMsg }, { quoted: m });

        } catch (e) {
            reply("Invalid move format! Use algebraic notation (e2e4)");
        }
    }
};

// Helper to render board nicely
function renderBoard(chess) {
    const board = chess.board();
    let str = '';
    const files = 'abcdefgh';
    for (let rank = 0; rank < 8; rank++) {
        str += `${8 - rank} `;
        for (let file = 0; file < 8; file++) {
            const piece = board[rank][file];
            str += piece ? piece : '·';
            str += ' ';
        }
        str += '\n';
    }
    str += '  a b c d e f g h';
    return str;
}

// Extra commands
module.exports.resign = {
    command: 'resign',
    description: 'Resign current chess game',
    category: 'fun',

    execute: async (sock, m) => {
        const game = global.chessGames.get(m.chat);
        if (!game) return reply("No active chess game!");

        global.chessGames.delete(m.chat);
        reply(`🏳️ Game resigned. ${m.sender.split('@')[0]} gave up.`);
    }
};