// commands/tools/define.js
// .define love

const fetch = require('node-fetch');

module.exports = {
    command: 'define',
    aliases: ['def', 'meaning'],
    description: 'Get definition of a word',
    category: 'tools',

    execute: async (sock, m, { args }) => {
        if (!args[0]) return reply("Usage: .define love");

        const word = args[0].trim().toLowerCase();

        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await res.json();

            if (data.title === "No Definitions Found") {
                return reply(`No definition found for "${word}"`);
            }

            const def = data[0];
            const meaning = def.meanings[0];
            const definition = meaning.definitions[0].definition;

            const menu = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
       *XADON AI  •  DEFINITION*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

┌──────────────────────────────┐
│  Word: ${def.word}           │
│  Type: ${meaning.partOfSpeech} │
│                              │
│  Definition:                 │
│  ${definition}               │
│                              │
│  Created by Musteqeem ✨      │
└──────────────────────────────┘`;

            await sock.sendMessage(m.chat, { text: menu }, { quoted: m });

        } catch (err) {
            reply("⚠️ Couldn't fetch definition.");
        }
    }
};