const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceIcon = path.join(__dirname, "../public/icon-source.png");
const outputDir = path.join(__dirname, "../public/icons");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

    await sharp(sourceIcon)
      .resize(size, size, {
        fit: "contain",
        background: { r: 255, g: 212, b: 0, alpha: 1 }, // #FFD400
      })
      .composite([
        {
          input: Buffer.from(
            `<svg><rect width="${size}" height="${size}" rx="${
              size * 0.2
            }" fill="#FFD400"/></svg>`
          ),
          blend: "dest-in",
        },
      ])
      .png()
      .toFile(outputPath);

    console.log(`Generated ${size}x${size} icon`);
  }
}

generateIcons().catch(console.error);
