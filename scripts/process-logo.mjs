// One-off: take the source ACA logo PNG and emit web-optimized variants.
import fs from 'node:fs/promises';
import sharp from 'sharp';

const src = 'public/logo.png';
const buf = await fs.readFile(src);
const meta = await sharp(buf).metadata();
console.log(`source: ${meta.width}x${meta.height} (${(buf.length / 1024).toFixed(1)} KB)`);

// 1. Clean transparent-friendly logo at common sizes
//    Trim outer whitespace, then resize to fit a square.
const trimmed = await sharp(buf).trim().toBuffer();

const sizes = [
  { name: 'logo-256.png', size: 256 },
  { name: 'logo-512.png', size: 512 },
];

// Transparent background so logo overlays cleanly on both cream and dark contexts.
for (const { name, size } of sizes) {
  const out = await sharp(trimmed)
    .resize({ width: size, height: size, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 90, compressionLevel: 9 })
    .toBuffer();
  await fs.writeFile(`public/${name}`, out);
  console.log(`✓ public/${name} (${(out.length / 1024).toFixed(1)} KB)`);
}

// Light variants (white logo on dark backgrounds): invert + force white through threshold.
// Use sharp's negate to flip the colors.
for (const { name, size } of [{ name: 'logo-256-light.png', size: 256 }, { name: 'logo-512-light.png', size: 512 }]) {
  const out = await sharp(trimmed)
    .resize({ width: size, height: size, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .negate({ alpha: false })
    .png({ quality: 90, compressionLevel: 9 })
    .toBuffer();
  await fs.writeFile(`public/${name}`, out);
  console.log(`✓ public/${name} (${(out.length / 1024).toFixed(1)} KB)`);
}

// 2. Favicons — generate LIGHT and DARK theme variants so the favicon stays
//    visible on any browser chrome color. Browsers pick via prefers-color-scheme.
//
//    LIGHT theme  → dark logo on cream background     (high contrast on light tabs)
//    DARK theme   → white logo on ink/black background (high contrast on dark tabs)

// Pre-build inverted (white) logo with transparent background.
const trimmedInvertedTransparent = await sharp(trimmed)
  .ensureAlpha()
  .negate({ alpha: false })
  .toBuffer();

for (const size of [16, 32, 48, 192]) {
  const innerSize = Math.round(size * 0.86); // slight inset so the logo doesn't touch the edges

  // === Light variant: dark logo composited onto cream canvas ===
  const darkLogo = await sharp(trimmed)
    .resize({ width: innerSize, height: innerSize, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const light = await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 247, g: 243, b: 236, alpha: 1 } }
  })
    .composite([{ input: darkLogo, gravity: 'center' }])
    .png()
    .toBuffer();
  await fs.writeFile(`public/favicon-${size}-light.png`, light);
  console.log(`✓ public/favicon-${size}-light.png (${(light.length / 1024).toFixed(1)} KB)`);

  // === Dark variant: white logo composited onto ink canvas ===
  const lightLogo = await sharp(trimmedInvertedTransparent)
    .resize({ width: innerSize, height: innerSize, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const dark = await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 22, g: 17, b: 11, alpha: 1 } }
  })
    .composite([{ input: lightLogo, gravity: 'center' }])
    .png()
    .toBuffer();
  await fs.writeFile(`public/favicon-${size}-dark.png`, dark);
  console.log(`✓ public/favicon-${size}-dark.png (${(dark.length / 1024).toFixed(1)} KB)`);
}

// 3. Apple touch icon (180x180 standard)
const apple = await sharp(trimmed)
  .resize({ width: 180, height: 180, fit: 'contain', background: { r: 22, g: 17, b: 11, alpha: 1 } })
  .png()
  .toBuffer();
await fs.writeFile('public/apple-touch-icon.png', apple);
console.log(`✓ public/apple-touch-icon.png (${(apple.length / 1024).toFixed(1)} KB)`);

// 4. /favicon.ico — Google and Bing fetch this URL directly when picking the
//    favicon for search results. Pack the dark-bg PNGs at 16/32/48 so the result
//    pops against the white search results page on every search engine.
//    ICO format: 6-byte header + N×16-byte directory entries + concatenated PNG payloads.
async function pngBufFromFavicon(size) {
  return await fs.readFile(`public/favicon-${size}-dark.png`);
}
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(icoSizes.map(pngBufFromFavicon));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);              // reserved
header.writeUInt16LE(1, 2);              // type: 1 = icon
header.writeUInt16LE(pngs.length, 4);    // image count
const dirEntries = [];
let offset = 6 + 16 * pngs.length;
for (let i = 0; i < pngs.length; i++) {
  const size = icoSizes[i];
  const png = pngs[i];
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0);    // width  (0 means 256)
  entry.writeUInt8(size === 256 ? 0 : size, 1);    // height
  entry.writeUInt8(0, 2);                          // palette
  entry.writeUInt8(0, 3);                          // reserved
  entry.writeUInt16LE(1, 4);                       // color planes
  entry.writeUInt16LE(32, 6);                      // bits per pixel
  entry.writeUInt32LE(png.length, 8);              // payload size
  entry.writeUInt32LE(offset, 12);                 // payload offset
  dirEntries.push(entry);
  offset += png.length;
}
const ico = Buffer.concat([header, ...dirEntries, ...pngs]);
await fs.writeFile('public/favicon.ico', ico);
console.log(`✓ public/favicon.ico (${(ico.length / 1024).toFixed(1)} KB, ${icoSizes.join('/')}px)`);

console.log('Done.');
