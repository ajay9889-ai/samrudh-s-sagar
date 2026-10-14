const sharp = require('sharp');
const fs = require('fs');

async function processImages() {
  const { data, info } = await sharp('public/samrudh-cutout-raw.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  // Clone buffer to manipulate pixels
  const fullBodyData = Buffer.from(data);

  // 1. Clean full body:
  // Remove car frame residue on the left:
  // The person's sleeve starts around x=190, his right hand extends to x=140, y=415-465.
  // Anything below y=465 on the left (x < 280, y > 465) where there's ghost debris
  // Let's check:
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      // Below the right hand (x < 240, y > 460 and y < 650)
      if (x < 240 && y > 460 && y < 650) {
        fullBodyData[idx + 3] = 0; // zero out alpha
      }
      // Left of the hand (x < 135)
      if (x < 135) {
        fullBodyData[idx + 3] = 0;
      }
      // Ground debris around feet: shoes are y: 780 to 885, below y=885 is ground dust
      if (y > 888) {
        fullBodyData[idx + 3] = 0;
      }
      // Ground debris to left of shoe (x < 330, y > 860)
      if (x < 330 && y > 860) {
        fullBodyData[idx + 3] = 0;
      }
    }
  }

  // Create clean full body in High-Contrast B&W
  const cleanFullBodyBW = await sharp(fullBodyData, {
    raw: { width, height, channels }
  })
    .extract({ left: 135, top: 290, width: 370, height: 600 }) // tight crop to person
    .grayscale()
    .linear(1.15, -12) // crisp contrast
    .png({ quality: 100 })
    .toBuffer();

  fs.writeFileSync('public/samrudh-fullbody.png', cleanFullBodyBW);
  console.log('Saved public/samrudh-fullbody.png');

  // 2. Create Mariana Napolitani-style Editorial Torso / Bust Portrait:
  // In Mariana's design, the portrait is framed from waist/belt up to the head,
  // showing head, jacket, open collar, and confident posture.
  // The head top is y ≈ 290, belt/lower jacket is y ≈ 590.
  // Height = 300px. Width from x=160 to x=480 (width ≈ 320px).
  // In this framing, the person is close-up, impactful, and fills the circle just like Mariana!
  const bustData = Buffer.from(data);
  // Clean car ghost in bust area
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      if (x < 140) bustData[idx + 3] = 0;
      if (x < 220 && y > 460) bustData[idx + 3] = 0;
    }
  }

  // Torso / Bust Portrait in B&W (Mariana Style)
  const bustBW = await sharp(bustData, {
    raw: { width, height, channels }
  })
    .extract({ left: 140, top: 285, width: 360, height: 310 })
    .grayscale()
    .linear(1.18, -14)
    .sharpen({ sigma: 1 })
    .png({ quality: 100 })
    .toBuffer();

  fs.writeFileSync('public/samrudh-portrait.png', bustBW);
  console.log('Saved public/samrudh-portrait.png');

  // Also 3/4 Mid-Body crop (down to mid-thigh, height ≈ 430px, from y=285 to y=715)
  const midBW = await sharp(fullBodyData, {
    raw: { width, height, channels }
  })
    .extract({ left: 135, top: 285, width: 370, height: 430 })
    .grayscale()
    .linear(1.16, -12)
    .sharpen({ sigma: 0.8 })
    .png({ quality: 100 })
    .toBuffer();

  fs.writeFileSync('public/samrudh-midbody.png', midBW);
  console.log('Saved public/samrudh-midbody.png');

  // Also copy the primary one to public/me.png with no palette compression
  fs.writeFileSync('public/me.png', cleanFullBodyBW);
}

processImages().catch(console.error);
