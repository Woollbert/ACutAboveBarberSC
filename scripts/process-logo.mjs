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

// 2. Favicons — real logo on cream background, sized for browser tabs.
//    Cream bg matches the site palette and gives the dark logo strokes high contrast.
for (const size of [16, 32, 48, 192]) {
  const fav = await sharp(trimmed)
    .resize({ width: size, height: size, fit: 'contain', background: { r: 247, g: 243, b: 236, alpha: 1 } })
    .png()
    .toBuffer();
  await fs.writeFile(`public/favicon-${size}.png`, fav);
  console.log(`✓ public/favicon-${size}.png (${(fav.length / 1024).toFixed(1)} KB)`);
}

// 3. Apple touch icon (180x180 standard)
const apple = await sharp(trimmed)
  .resize({ width: 180, height: 180, fit: 'contain', background: { r: 22, g: 17, b: 11, alpha: 1 } })
  .png()
  .toBuffer();
await fs.writeFile('public/apple-touch-icon.png', apple);
console.log(`✓ public/apple-touch-icon.png (${(apple.length / 1024).toFixed(1)} KB)`);

console.log('Done.');
