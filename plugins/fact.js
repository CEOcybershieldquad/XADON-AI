// commands/fun/fact.js
// .fact   → random interesting fact + illustration

const facts = [
    "Octopuses have three hearts.",
    "A flock of crows is known as a murder.",
    "Honey never spoils.",
    "Bananas are berries, but strawberries aren’t.",
    "The Eiffel Tower can be 15 cm taller during the summer.",
    "A day on Venus is longer than a year on Venus.",
    "The shortest war in history lasted 38 minutes.",
    "A group of flamingos is called a flamboyance.",
    "The unicorn is the national animal of Scotland.",
    "There are more trees on Earth than there are stars in the Milky Way.",
    "Wombat poop is cube-shaped.",
    "A flock of owls is called a parliament.",
    "The smell of rain is caused by a bacteria called actinomycetes.",
    "The heart of a shrimp is in its head.",
    "The shortest commercial flight in the world is 1.7 miles.",
    "A group of rhinos is called a crash.",
    "The first computer 'bug' was an actual insect.",
    "The Eiffel Tower grows about 6 inches in summer due to heat expansion.",
    "A group of jellyfish is called a smack.",
    "The quietest room in the world is located at Microsoft’s headquarters.",
    "The longest word in English has 189,819 letters.",
    "A group of porcupines is called a prickle.",
    "The shortest war in history was between Britain and Zanzibar in 1896.",
    "A group of kangaroos is called a mob.",
    "The only letter that doesn’t appear in any U.S. state name is Q.",
    "A group of ferrets is called a business.",
    "The longest time between two twins being born is 87 days.",
    "A group of giraffes is called a tower.",
    "The first oranges weren’t orange — they were green.",
    "A group of owls is called a parliament.",
    "The shortest commercial flight in the world is 57 seconds.",
    "A group of flamingos is called a flamboyance.",
    "The unicorn is Scotland’s national animal.",
    "A group of rhinos is called a crash.",
    "The heart of a shrimp is in its head.",
    "A group of jellyfish is called a smack.",
    "The Eiffel Tower can be 15 cm taller during the summer.",
    "A group of porcupines is called a prickle.",
    "The shortest war in history lasted 38 minutes.",
    "A group of crows is called a murder.",
    "The first computer bug was an actual insect.",
    "A group of kangaroos is called a mob.",
    "The only letter that doesn’t appear in any U.S. state name is Q.",
    "A group of ferrets is called a business.",
    "The longest time between two twins being born is 87 days.",
    "A group of giraffes is called a tower.",
    "The first oranges weren’t orange — they were green.",
    "A group of flamingos is called a flamboyance.",
    "The unicorn is the national animal of Scotland.",
    "A group of rhinos is called a crash."
];

module.exports = {
    command: 'fact',
    aliases: ['randomfact'],
    description: 'Get a random interesting fact with illustration',
    category: 'fun',

    execute: async (sock, m) => {
        const fact = facts[Math.floor(Math.random() * facts.length)];

        // Choose a relevant illustration search term
        const searchTerms = [
            "interesting nature fact illustration",
            "fun animal trivia art",
            "scientific wonder cartoon",
            "random fact visual explanation",
            "amazing world knowledge drawing"
        ];
        const imageDesc = searchTerms[Math.floor(Math.random() * searchTerms.length)];

        const menu = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
       *XADON AI  •  RANDOM FACT*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

${fact}

> Created by Musteqeem ✨`;

        await sock.sendMessage(m.chat, { text: menu }, { quoted: m });

        // Trigger image search & render
        // (In real code you would call search_images tool here)
        // Example placeholder:
        //
        // 
    }
};