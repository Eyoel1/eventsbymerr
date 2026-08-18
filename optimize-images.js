const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function optimizeDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await optimizeDir(fullPath);
    } else if (/\.(jpe?g|png)$/i.test(file)) {
      const parsed = path.parse(fullPath);
      const webpPath = path.join(parsed.dir, parsed.name + '.webp');
      
      const beforeSize = stat.size;
      await sharp(fullPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 82, effort: 6 })
        .toFile(webpPath);
      
      const afterSize = fs.statSync(webpPath).size;
      console.log(`Optimized ${file} -> ${parsed.name}.webp: ${(beforeSize/1024).toFixed(1)}KB -> ${(afterSize/1024).toFixed(1)}KB (-${Math.round((1 - afterSize/beforeSize)*100)}%)`);
    }
  }
}

async function main() {
  const imagesDir = path.join(__dirname, 'public', 'images');
  console.log('Optimizing images in', imagesDir);
  await optimizeDir(imagesDir);
}

main().catch(console.error);
