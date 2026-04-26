module.exports = {
  command: '8ball',
  aliases: ['ask', 'magicball'],
  category: 'fun',
  description: 'Ask the magic 8-ball a question',
  usage: '.8ball Will I be rich?',
  execute: async (sock, m, { args, reply }) => {
    if (!args.length) {
      return reply("Ask the 8-ball something! Example: .8ball Will I win today?");
    }
    const question = args.join(" ");
    const answers = [
      "Yes – definitely.",
      "It is decidedly so.",
      "Without a doubt.",
      "Reply hazy, try again.",
      "Ask again later.",
      "Better not tell you now.",
      "My sources say no.",
      "Outlook not so good.",
      "Very doubtful.",
      "Signs point to yes.",
      "Concentrate and ask again.",
      "Don't count on it.",
      "Yes.",
      "Most likely.",
      "Cannot predict now.",
      "As I see it, yes."
    ];
    const answer = answers[Math.floor(Math.random() * answers.length)];
    await sock.sendMessage(m.chat, {
      text: `🎱 *Magic 8-Ball*\n\nQuestion: ${question}\nAnswer: *${answer}*`,
    }, { quoted: m });
    await sock.sendMessage(m.chat, { react: { text: "🎱", key: m.key } });
  }
};