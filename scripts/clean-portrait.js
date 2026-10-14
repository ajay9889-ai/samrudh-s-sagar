const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function main() {
  const inputPath = path.resolve("public/me.png");
  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;

  // Let's inspect where his wrist and hand are.
  // In our 454 x 615 image:
  // His hand is around x ~ 95..135, y ~ 130..170.
  // The car debris is:
  // - everything with x < 95
  // - and below his hand (y > 175) for x < 130 (the dangling car frame)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // 1. Car debris to the left of the hand
      if (x < 92) {
        data[idx + 3] = 0; // alpha = 0
      } else if (x < 118 && y > 165) {
        // under the hand is empty air / car wreck
        data[idx + 3] = 0;
      }

      // 2. Dirt / ground dust under the shoes (bottom ~15px)
      if (y > 595 && x < 350) {
        data[idx + 3] = 0;
      }
    }
  }

  // Save the full figure clean cut-out
  await sharp(data, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .trim()
    .png({ quality: 95 })
    .toFile(path.resolve("public/me.png"));

  console.log("Updated public/me.png successfully.");

  // Also create a 3/4 / waist-up version (from head down to hips/jacket hem)
  // which matches the Mariana bust-style reference framing!
  // Head is at top, hips/jacket hem is around 60% of total height (~380px)
  await sharp(path.resolve("public/me.png"))
    .extract({
      left: 0,
      top: 0,
      width: (await sharp(path.resolve("public/me.png")).metadata()).width,
      height: Math.round((await sharp(path.resolve("public/me.png")).metadata()).height * 0.65),
    })
    .png({ quality: 95 })
    .toFile(path.resolve("public/me-bust.png"));

  console.log("Created public/me-bust.png");
}

main().catch(console.error);
