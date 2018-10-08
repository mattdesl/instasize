const { buffer, text, json, send } = require('micro')
const Jimp = require('jimp');

module.exports = async (req, res) => {
  const base64 = await text(req, {
    limit: '10mb'
  });

  if (!base64) {
    return 'Error: Must send base64 image data to this endpoint';
  }

  const data = Buffer.from(base64, 'base64');
  const image = await Jimp.read(data);

  // Max image size
  const maxWidth = 2048;
  const maxHeight = 2048;

  // White background
  image.background(0xFFFFFFFF);

  // Resize to fit & contain within size
  image.contain(maxWidth, maxHeight);

  // Return base64
  const mime = image.getMIME();
  const pngBuffer = await image.getBufferAsync(mime);

  res.writeHead(200, { 'Content-Type': mime });
  res.end(pngBuffer, 'binary');
};
