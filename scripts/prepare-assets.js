const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const artifactDir = path.resolve('C:/Users/ajayh/.gemini/antigravity-ide/brain/b5a45f7d-1fbe-49f6-9e28-cd83f89230d9');
  const publicDir = path.resolve('public');
  const projectsDir = path.join(publicDir, 'projects');

  if (!fs.existsSync(projectsDir)) {
    fs.mkdirSync(projectsDir, { recursive: true });
  }

  // 1. Process portrait into cut-out transparent PNG
  const portraitFile = path.join(artifactDir, 'designer_portrait_1791902515054.jpg');
  if (fs.existsSync(portraitFile)) {
    const { data, info } = await sharp(portraitFile)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Threshold out pure white / off-white background
    // Since it's a studio shot with bright white background
    const threshold = 240;
    const feather = 15;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

      if (brightness >= threshold) {
        data[i + 3] = 0; // completely transparent
      } else if (brightness > threshold - feather) {
        const factor = (threshold - brightness) / feather;
        data[i + 3] = Math.round(255 * factor);
      }
    }

    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      },
    })
      .png()
      .toFile(path.join(publicDir, 'me.png'));
    console.log('Saved public/me.png');
  }

  // 2. Copy project 1 (Branding & Identity)
  const p1File = path.join(artifactDir, 'branding_project_1791902543169.jpg');
  if (fs.existsSync(p1File)) {
    await sharp(p1File)
      .resize(800, 920, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toFile(path.join(projectsDir, 'project-1.jpg'));
    console.log('Saved public/projects/project-1.jpg');
  }

  // 3. Copy project 2 (Social Media Creatives)
  const p2File = path.join(artifactDir, 'social_project_1791902567055.jpg');
  if (fs.existsSync(p2File)) {
    await sharp(p2File)
      .resize(800, 920, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toFile(path.join(projectsDir, 'project-2.jpg'));
    console.log('Saved public/projects/project-2.jpg');
  }

  // 4. Create Project 3 (Packaging Design - sleek black tile with graphic elements)
  // Dimensions 800x920 (~1:1.15)
  const svgOverlay = Buffer.from(`
    <svg width="800" height="920" viewBox="0 0 800 920" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="920" fill="#111111"/>
      <!-- Decorative geometric minimal lines -->
      <line x1="80" y1="80" x2="720" y2="80" stroke="#222222" stroke-width="2"/>
      <line x1="80" y1="840" x2="720" y2="840" stroke="#222222" stroke-width="2"/>
      
      <!-- Brand geometry center -->
      <rect x="220" y="240" width="360" height="420" fill="#181818" stroke="#333333" stroke-width="1"/>
      <circle cx="400" cy="410" r="110" fill="none" stroke="#00A19C" stroke-width="2"/>
      <line x1="290" y1="520" x2="510" y2="520" stroke="#80142B" stroke-width="3"/>
      
      <text x="400" y="380" font-family="sans-serif" font-size="14" font-weight="bold" fill="#80142B" letter-spacing="6" text-anchor="middle">ATELIER NOIR</text>
      <text x="400" y="425" font-family="sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" letter-spacing="4" text-anchor="middle">PACKAGING</text>
      <text x="400" y="460" font-family="sans-serif" font-size="13" fill="#A0A0A0" letter-spacing="3" text-anchor="middle">SERIES 2026 // EDITION 03</text>
      <text x="400" y="580" font-family="sans-serif" font-size="12" fill="#777777" letter-spacing="4" text-anchor="middle">SUSTAINABLE LUXURY BOX &amp; BOTTLE</text>
      
      <rect x="80" y="80" width="30" height="4" fill="#00A19C"/>
    </svg>
  `);

  await sharp(svgOverlay)
    .jpeg({ quality: 90 })
    .toFile(path.join(projectsDir, 'project-3.jpg'));
  console.log('Saved public/projects/project-3.jpg');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
