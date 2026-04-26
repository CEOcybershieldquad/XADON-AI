const config = {
  xdetect: {
    bot: false,
    bug: false,
    link: false,
    spam: false,
    virus: false,
  },
  messageCounts: {},
};

module.exports = {
  command: 'xdetect',
  description: 'Toggle detection features for 𝐗𝐀𝐃𝐎𝐍',
  category: 'group',
  execute: async (sock, m, { args, reply, config: cmdConfig, groupId }) => {
    try {
      if (!m.groupId) return reply('This command only works in groups');

      const options = ['bot', 'bug', 'link', 'spam', 'virus'];
      if (args[0] && options.includes(args[0].toLowerCase())) {
        const feature = args[0].toLowerCase();
        if (args¹ === 'on') {
          config.xdetect[feature] = true;
          reply(`${feature} detection enabled`);
        } else if (args === 'off') {
          config.xdetect[feature] = false;
          reply(`${feature} detection disabled`);
        } else {
          reply(`Current ${feature} detection: ${config.xdetect[feature] ? 'ON' : 'OFF'}`);
        }
      } else {
        reply(`Usage: xdetect [bot/bug/link/spam/virus] on/off`);
      }
    } catch (error) {
      console.error("Error in xdetect command:", error);
      reply("An error occurred while processing the command");
    }
  },
};

// Detection logic
const detect = async (sock, m) => {
  if (config.xdetect.spam) {
    const userId = m.author || m.from;
    if (!config.messageCounts[userId]) config.messageCounts[userId] = [];
    config.messageCounts[userId].push(Date.now());
    if (config.messageCounts[userId].length > 5) {
      const oldestMessage = config.messageCounts[userId].shift();
      if (Date.now() - oldestMessage < 10000) { // 10 seconds
        await sock.sendMessage(m.chat, { react: { text: "🚫", key: m.key } });
        await sock.sendMessage(m.chat, { text: 'Spam detected!' }, { quoted: m });
        // Add spam handling logic here (e.g., mute user, delete messages)
      }
    }
  }

  if (config.xdetect.virus && isInvisibleMessage(m)) {
    await sock.sendMessage(m.chat, { react: { text: "⚠️", key: m.key } });
    await sock.sendMessage(m.chat, { text: 'Virus detected!' }, { quoted: m });
    // Add virus handling logic here (e.g., delete message, ban user)
  }

  if (config.xdetect.link && isLink(m.body)) {
    await sock.sendMessage(m.chat, { react: { text: "🔗", key: m.key } });
    await sock.sendMessage(m.chat, { text: 'Link detected!' }, { quoted: m });
    // Add link handling logic here
  }

  if (config.xdetect.bug && isBug(m)) {
    await sock.sendMessage(m.chat, { react: { text: "🐜", key: m.key } });
    await sock.sendMessage(m.chat, { text: 'Bug detected!' }, { quoted: m });
    // Add bug handling logic here
  }
};

const isInvisibleMessage = (m) => {
  return m.body === '' && m.hasMedia === false && m.hasQuotedMsg === false;
};

const isLink = (text) => {
  return /\bhttps?:\/\/\S+/gi.test(text);
};

const isBug = (m) => {
  // Add bug detection logic here (e.g., check for malicious media files)
  // For example:
  return m.hasMedia && m.mediaType === 'image/jpeg' && m.body.includes('malicious-code');
};

// Clean up message counts periodically
setInterval(() => {
  Object.keys(config.messageCounts).forEach((userId) => {
    config.messageCounts[userId] = config.messageCounts[userId].filter((timestamp) => Date.now() - timestamp < 10000);
  });
}, 10000);

// Export detection logic
module.exports.detect = detect;