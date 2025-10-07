import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const androidSize = [48, 72, 96, 128, 144, 152, 192, 384, 512];
const iosSizes = [
  16, 20, 29, 32, 40, 50, 57, 58, 60, 64, 72, 76, 80, 100, 114, 120, 128, 144,
  152, 167, 180, 192, 256, 512, 1024,
];
const sizes = iosSizes;
console.log("generating icons");
const sourceIcon = path.join(__dirname, "../public/icon-source.png");
const outputDir = path.join(__dirname, "../public/ios");
console.log("generating icons, outputDir");
// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `${size}.png`);

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
