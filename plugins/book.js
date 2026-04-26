module.exports = {
    command: 'book',
    aliases: ['books'],
    category: 'fun',
    description: 'Get smart book recommendation',
    usage: '.book mindset / business / coding',

    execute: async (sock, m, { args }) => {

        const category = args[0]?.toLowerCase();

        const library = {
            mindset: [
                "📘 Atomic Habits — James Clear",
                "📗 Can't Hurt Me — David Goggins",
                "📕 Think and Grow Rich — Napoleon Hill"
            ],
            business: [
                "📘 Rich Dad Poor Dad — Robert Kiyosaki",
                "📗 The Psychology of Money — Morgan Housel",
                "📕 Zero to One — Peter Thiel"
            ],
            coding: [
                "📘 Clean Code — Robert C. Martin",
                "📗 You Don’t Know JS — Kyle Simpson",
                "📕 The Pragmatic Programmer"
            ],
            default: [
                "📘 The Alchemist — Paulo Coelho",
                "📗 Deep Work — Cal Newport",
                "📕 48 Laws of Power — Robert Greene"
            ]
        };

        const list = library[category] || library.default;
        const pick = list[Math.floor(Math.random() * list.length)];

        const msg = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
   *XADON AI • PRO BOOK*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

📚 Category: ${category || 'random'}

${pick}

💡 Level up your mind

> XADON AI`;

        await sock.sendMessage(m.chat, { text: msg }, { quoted: m });
    }
};