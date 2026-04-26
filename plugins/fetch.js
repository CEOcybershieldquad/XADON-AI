const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  command: 'fetch',
  alias: ['search', 'google', 'f'],
  description: '*Musteqeem MD* :Xadon-mode search: summary + related topics + always attaches image',
  category: 'tools',

  execute: async (sock, m, { reply, text }) => {
    if (!text) return reply('Usage: .fetch your question or topic');

    // Reactions first (premium feel)
    const emojis = ['👾', '📦', '🌀', '🚀', '✅'];
    for (const emoji of emojis) {
      await sock.sendMessage(m.chat, { react: { text: emoji, key: m.key } });
    }

    try {
      const query = text.trim();

      // Step 1: DuckDuckGo text search (summary + related topics)
      const ddUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&pretty=1`;
      const ddResponse = await axios.get(ddUrl);
      const ddData = ddResponse.data;

      let title = query;
      let summary = '';
      let link = 'https://duckduckgo.com/';
      let relatedInfo = '';

      if (ddData.Abstract) {
        summary = ddData.Abstract;
        title = ddData.Heading || query;
        link = ddData.Results?.[0]?.FirstURL || link;
      } else if (ddData.RelatedTopics?.length) {
        // Smart fallback to related topics
        const top = ddData.RelatedTopics[0];
        title = top.Text?.split(' - ')[0] || query;
        summary = top.Text || 'Related information found.';
        link = top.FirstURL || link;

        // More related
        if (ddData.RelatedTopics.length > 1) {
          relatedInfo = `*Related Topics*\n`;
          ddData.RelatedTopics.slice(1, 5).forEach(t => {
            if (t.Text) relatedInfo += `• ${t.Text}\n`;
            if (t.FirstURL) relatedInfo += `  🔗 ${t.FirstURL}\n`;
          });
        }
      }

      // Shorten summary for box
      const shortSummary = summary.length > 250 ? summary.substring(0, 250) + '...' : summary;

      // Boxed format (like your Wikipedia example)
      let result = `┏━━━━━━━━━━〔 🤖 FETCH RESULT 🤖 〕━━━━━━━━┓\n`;
      result += `┃\n`;
      result += `┃  🏷️ Title   : ${title}\n`;
      result += `┃  📝 Summary : ${shortSummary}\n`;
      if (relatedInfo) result += `┃\n${relatedInfo}\n`;
      result += `┃  📎 Link    : ${link}\n`;
      result += `┃  🖋 Source  : DuckDuckGo\n`;
      result += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n`;

      // Send boxed text
      await sock.sendMessage(m.chat, { text: result }, { quoted: m });

      // Step 2: Always search for a matching image (Unsplash premium scraper)
      const imageQuery = encodeURIComponent(query);
      const unsplashUrl = `https://unsplash.com/s/photos/${imageQuery}`;

      const unsplashResponse = await axios.get(unsplashUrl, {
        headers: { 'User-Agent': 'CRYSNOVA-BOT/1.0' }
      });

      const $ = cheerio.load(unsplashResponse.data);
      const images = [];

      // Extract high-res Unsplash images
      $('img[srcset]').each((i, el) => {
        const srcset = $(el).attr('srcset');
        if (!srcset) return;
        const parts = srcset.split(',').map(p => p.trim().split(' ')[0]);
        const hiRes = parts.pop(); // highest resolution
        if (hiRes && !images.includes(hiRes)) images.push(hiRes);
      });

      if (images.length > 0) {
        // Pick a good one (random from top 5)
        const imageUrl = images[Math.floor(Math.random() * Math.min(5, images.length))];

        try {
          const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          const imgBuffer = Buffer.from(imgResponse.data, 'binary');

          await sock.sendMessage(m.chat, {
            image: imgBuffer,
            caption: `Matching image for "${query}"`
          }, { quoted: m });
        } catch (imgErr) {
          console.error('Image send failed:', imgErr.message);
        }
      } else {
        // Fallback message if no image found
        await sock.sendMessage(m.chat, {
          text: `No direct image found — try a more visual query like "${query} photo"`
        }, { quoted: m });
      }

    } catch (err) {
      console.error('Fetch error:', err.message);
      reply('Search failed — try a different query or check connection.');
    }
  }
};
