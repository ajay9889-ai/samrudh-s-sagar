const sharp = require('sharp');
const fs = require('fs');

async function main() {
  const { data, info } = await sharp('public/samrudh-cutout-raw.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // ----------------------------------------------------
  // 1. High-Precision Clean Full Body
  // ----------------------------------------------------
  const full = Buffer.from(data);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;

      // Car frame residue below right hand
      if (x < 240 && y > 460 && y < 650) {
        full[idx + 3] = 0;
      }
      // Residue left of right hand
      if (x < 135) {
        full[idx + 3] = 0;
      }

      // Shoes cleaning:
      // Front right shoe: x: 330 to 400, y: 840 to 885.
      // Back/right foot crossed behind: x: 420 to 480, y: 815 to 875.
      // Dirt under front shoe (y > 880):
      if (y > 880) {
        full[idx + 3] = 0;
      }
      // Dirt under/left of front shoe (x < 340 && y > 860):
      if (x < 340 && y > 860) {
        full[idx + 3] = 0;
      }
      // Debris around ground (x < 370 && y > 875):
      if (x < 370 && y > 875) {
        full[idx + 3] = 0;
      }
    }
  }

  // Generate crisp full-body B&W
  const cleanFullBody = await sharp(full, {
    raw: { width, height, channels }
  })
    .extract({ left: 135, top: 285, width: 370, height: 600 })
    .grayscale()
    .linear(1.18, -14)
    .sharpen({ sigma: 0.8 })
    .png({ quality: 100 })
    .toBuffer();

  fs.writeFileSync('public/samrudh-fullbody-clean.png', cleanFullBody);
  console.log('Created public/samrudh-fullbody-clean.png');

  // ----------------------------------------------------
  // 2. Mariana Napolitani-Style 3/4 Editorial Torso Portrait
  // Exactly matching the reference layout:
  // Top: 285 (top of hair)
  // Bottom: 645 (lower jacket hem / hip)
  // Flush horizontal straight line at bottom
  // ----------------------------------------------------
  const torso = Buffer.from(data);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      if (x < 140) torso[idx + 3] = 0;
      if (x < 235 && y > 460) torso[idx + 3] = 0;
    }
  }

  const torsoBW = await sharp(torso, {
    raw: { width, height, channels }
  })
    .extract({ left: 135, top: 280, width: 370, height: 380 }) // 380px tall: head to mid-hip
    .grayscale()
    .linear(1.2, -15)
    .sharpen({ sigma: 1 })
    .png({ quality: 100 })
    .toBuffer();

  fs.writeFileSync('public/samrudh-editorial-portrait.png', torsoBW);
  console.log('Created public/samrudh-editorial-portrait.png');
}

main().catch(console.error);
