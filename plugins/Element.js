// commands/tools/element.js
// .element gold   or .element Fe

const elements = {
    "gold": { symbol: "Au", atomic: 79, name: "Gold", group: "Transition metal", desc: "Shiny yellow metal, used in jewelry and electronics" },
    "iron": { symbol: "Fe", atomic: 26, name: "Iron", group: "Transition metal", desc: "Essential for steel and hemoglobin" },
    "oxygen": { symbol: "O", atomic: 8, name: "Oxygen", group: "Non-metal", desc: "We breathe it, makes up \~21% of air" },
    "carbon": { symbol: "C", atomic: 6, name: "Carbon", group: "Non-metal", desc: "Basis of all known life" },
    // add more elements as needed...
};

module.exports = {
    command: 'element',
    aliases: ['elem', 'chem'],
    description: 'Get info about a chemical element',
    category: 'tools',

    execute: async (sock, m, { args }) => {
        if (!args[0]) return reply("Usage: .element gold");

        const query = args[0].toLowerCase();
        const elem = elements[query] || Object.values(elements).find(e => e.symbol.toLowerCase() === query);

        if (!elem) return reply("Element not found. Try: gold, iron, oxygen, carbon...");

        const menu = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
       *XADON AI  •  ELEMENT INFO*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

┌──────────────────────────────┐
│  Name: \( {elem.name} ( \){elem.symbol})   │
│  Atomic number: ${elem.atomic}       │
│  Group: ${elem.group}            │
│                              │
│  Description:                │
│  ${elem.desc}                │
│                              │
│  Created by Musteqeem ✨      │
└──────────────────────────────┘`;

        await sock.sendMessage(m.chat, { text: menu }, { quoted: m });
    }
};