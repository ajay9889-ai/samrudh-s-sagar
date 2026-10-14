const sharp = require('sharp');
const fs = require('fs');

async function createLeanCutout() {
  // Load raw cutout (683 x 1024)
  const { data, info } = await sharp('public/samrudh-cutout-raw.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const cleaned = Buffer.from(data);

  // Let's inspect hand and car area:
  // In raw photo:
  // Hand starts around x = 135 to 220, y = 410 to 465.
  // Car debris is below y = 465 on the left (x < 240, y > 465).
  // Car roof strut to the left of the hand (x < 135):
  // Let's look closely at the hand fingers:
  // Fingers are at x: 135 to 175, y: 420 to 460.
  // Thumb is at x: 130 to 155, y: 415 to 445.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;

      // 1. Clear everything left of the hand (x < 125)
      if (x < 125) {
        cleaned[idx + 3] = 0;
      }

      // 2. Clear car frame under the hand/wrist:
      // The hand ends at y = 465. Below y = 465 and x < 230 is empty space / car frame.
      if (x < 235 && y > 465 && y < 650) {
        cleaned[idx + 3] = 0;
      }

      // 3. Clean transition under the thumb/fingers (x < 145, y > 450)
      if (x < 142 && y > 448 && y < 470) {
        cleaned[idx + 3] = 0;
      }

      // 4. Ground debris under shoes:
      // Lowest sole of shoe is at y ≈ 882. Below that is ground dust.
      if (y > 880) {
        cleaned[idx + 3] = 0;
      }
      if (x < 340 && y > 855) {
        cleaned[idx + 3] = 0;
      }
      if (x < 365 && y > 875) {
        cleaned[idx + 3] = 0;
      }
      // Top background dust if any (above hair, y < 280)
      if (y < 280) {
        cleaned[idx + 3] = 0;
      }
    }
  }

  // Extract from x=125 to x=505 (width = 380), top=280 to bottom=880 (height = 600)
  // This preserves the entire person: head, hair, jacket, hand with fingertips, jeans, boots!
  const finalBW = await sharp(cleaned, { raw: { width, height, channels } })
    .extract({ left: 125, top: 280, width: 380, height: 602 })
    .grayscale()
    .linear(1.18, -14)
    .sharpen({ sigma: 0.8 })
    .png({ quality: 100 })
    .toBuffer();

  fs.writeFileSync('public/samrudh-lean.png', finalBW);
  console.log('Successfully created public/samrudh-lean.png');

  // Also verify exact hand position in samrudh-lean.png
  const meta = await sharp(finalBW).raw().toBuffer({ resolveWithObject: true });
  let minHandX = 380, minHandY = 602, maxHandX = 0, maxHandY = 0;
  for (let y = 0; y < 250; y++) {
    for (let x = 0; x < 150; x++) {
      const idx = (y * meta.info.width + x) * meta.info.channels;
      if (meta.data[idx + 3] > 40) {
        if (x < minHandX) minHandX = x;
        if (x > maxHandX) maxHandX = x;
        if (y < minHandY) minHandY = y;
        if (y > maxHandY) maxHandY = y;
      }
    }
  }
  console.log('Hand extents in samrudh-lean.png:', { minHandX, maxHandX, minHandY, maxHandY });
}

createLeanCutout().catch(console.error);
