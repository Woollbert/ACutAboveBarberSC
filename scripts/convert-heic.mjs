// One-off script: convert + resize all photos in a folder to web-friendly JPGs.
// HEIC → JPG via heic-convert; everything else passed through sharp.
// Output: max 1600px on long side, ~82% quality JPEG.
// Run: node scripts/convert-heic.mjs <inputDir> <outputDir>

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import heicConvert from 'heic-convert';
import sharp from 'sharp';

const [, , inputDir, outputDir] = process.argv;
if (!inputDir || !outputDir) {
  console.error('Usage: node scripts/convert-heic.mjs <inputDir> <outputDir>');
  process.exit(1);
}

await fs.mkdir(outputDir, { recursive: true });
const files = await fs.readdir(inputDir);

let i = 0;
for (const f of files) {
  const ext = path.extname(f).toLowerCase();
  if (!/\.(heic|jpe?g|png)$/i.test(ext)) continue;
  i += 1;

  const inPath = path.join(inputDir, f);
  // Stable, web-friendly output name based on a hash of the original name.
  const hash = crypto.createHash('sha1').update(f).digest('hex').slice(0, 8);
  const outName = `cut-${String(i).padStart(2, '0')}-${hash}.jpg`;
  const outPath = path.join(outputDir, outName);

  try {
    let imageBuffer;
    if (/\.heic$/i.test(ext)) {
      const heic = await fs.readFile(inPath);
      imageBuffer = Buffer.from(await heicConvert({ buffer: heic, format: 'JPEG', quality: 0.92 }));
    } else {
      imageBuffer = await fs.readFile(inPath);
    }
    const optimized = await sharp(imageBuffer)
      .rotate() // honor EXIF orientation
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    await fs.writeFile(outPath, optimized);
    console.log(`✓ ${f} → ${outName} (${(optimized.length / 1024).toFixed(0)} KB)`);
  } catch (err) {
    console.error(`✗ ${f}: ${err.message}`);
  }
}
console.log(`Done. Processed ${i} file(s).`);
