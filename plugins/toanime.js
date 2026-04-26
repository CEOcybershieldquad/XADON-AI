const axios = require("axios")
module.exports = {
  command: 'x_toanime',
  description: 'Turn images to anime (owner only)',
  category: 'downloader'

execute: async (sock, m, { args, reply }) => {
  try {
    const { data } = await axios.post("https://tools.revesery.com/image-anime/convert.php", new URLSearchParams(Object.entries({
      "image-url": url
    })));
    return Buffer.from(data.image.split(",")[1], "base64");
  } catch (error) {
    console.error(error);
    throw 'Error in jadianime function';
  }
}

module.exports = { jadianime }