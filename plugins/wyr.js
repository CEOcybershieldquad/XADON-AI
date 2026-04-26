// commands/fun/wyr.js
// .wyr  → random "Would You Rather" question + illustration

const questions = [
    "Would you rather have unlimited money or unlimited time?",
    "Would you rather be able to fly or be invisible?",
    "Would you rather lose your sight or your hearing?",
    "Would you rather live in the past or the future?",
    "Would you rather always tell the truth or always lie?",
    "Would you rather have 1 million dollars now or 1 dollar every second for the rest of your life?",
    "Would you rather be the richest person in the world or the smartest?",
    "Would you rather explore space or the deepest ocean?",
    "Would you rather be famous or anonymous?",
    "Would you rather have a rewind button or a pause button in life?",
    "Would you rather be able to talk to animals or speak every language?",
    "Would you rather live without music or without movies?",
    "Would you rather have super strength or super speed?",
    "Would you rather be able to change the past or see the future?",
    "Would you rather live in a big city or in nature?",
    "Would you rather be feared or loved?",
    "Would you rather have a photographic memory or perfect physical health?",
    "Would you rather be able to teleport or time travel?",
    "Would you rather never get sick again or never feel pain?",
    "Would you rather be able to read minds or control minds?",
    "Would you rather live forever young or die at 100 with perfect health?",
    "Would you rather have a personal chef or a personal trainer?",
    "Would you rather be able to stop time or go back in time?",
    "Would you rather have infinite battery life on your phone or infinite storage?",
    "Would you rather be able to breathe underwater or survive in space?",
    "Would you rather have every meal taste amazing or never gain weight?",
    "Would you rather be able to talk to your past self or future self?",
    "Would you rather have a perfect memory or perfect concentration?",
    "Would you rather live in a world with no internet or no electricity?",
    "Would you rather be able to shapeshift or have super healing?",
    "Would you rather win the lottery once or earn $100k every year?",
    "Would you rather have a pet dragon or a pet unicorn?",
    "Would you rather be able to speak to the dead or predict the future?",
    "Would you rather have unlimited travel or unlimited food?",
    "Would you rather be able to see 10 minutes into the future or 150 years?",
    "Would you rather have a rewind button for life or a pause button?",
    "Would you rather live without social media or without music?",
    "Would you rather be able to control fire or water?",
    "Would you rather have every book you've read in your head or every movie?",
    "Would you rather be able to fly at 100 km/h or run at 100 km/h?",
    "Would you rather have a clone of yourself or a time machine?",
    "Would you rather never age after 25 or never feel tired?",
    "Would you rather be able to talk to plants or talk to machines?",
    "Would you rather live in a treehouse or underwater house?",
    "Would you rather have a personal AI assistant or a personal chef?",
    "Would you rather be able to see everyone's true intentions or never lie?",
    "Would you rather have infinite money but no friends or lots of friends but poor?",
    "Would you rather be able to change one event in history or know when you die?",
    "Would you rather have superhuman senses or superhuman reflexes?",
    "Would you rather live in a world where everyone is honest or everyone is kind?",
    "Would you rather have a perfect body or a perfect mind?"
];

module.exports = {
    command: 'wyr',
    aliases: ['wouldyourather'],
    description: 'Play Would You Rather with illustration',
    category: 'fun',

    execute: async (sock, m) => {
        const question = questions[Math.floor(Math.random() * questions.length)];

        // Choose a descriptive search term for illustration
        const searchTerms = [
            "would you rather cartoon illustration",
            "fun dilemma choice art",
            "two paths decision fantasy",
            "split path magical illustration",
            "choice between two worlds art"
        ];
        const imageDesc = searchTerms[Math.floor(Math.random() * searchTerms.length)];

        const menu = `✦ ───── ⋆⋅☆⋅⋆ ───── ✦
       *XADON AI  •  WOULD YOU RATHER*
✦ ───── ⋆⋅☆⋅⋆ ───── ✦

${question}

Reply with your choice! 😏

> Created by Musteqeem ✨`;

        await sock.sendMessage(m.chat, { text: menu }, { quoted: m });

        // Trigger image search & render
        // (Assuming you have search_images tool and render_searched_image component)
        // In real code you would call the tool here.
        // For this example, imagine the tool returns an image_id
        // Then render it:
        //
        // 
    }
};