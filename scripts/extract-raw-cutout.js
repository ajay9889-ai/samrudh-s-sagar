const { removeBackground } = require("@imgly/background-removal-node");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function main() {
  const inputPath = path.resolve(
    "C:/Users/ajayh/.gemini/antigravity-ide/brain/b5a45f7d-1fbe-49f6-9e28-cd83f89230d9/.user_uploaded/media_1791907971109.jpg"
  );

  console.log("Reading user photo:", inputPath);
  const fileBuffer = fs.readFileSync(inputPath);
  const inputBlob = new Blob([fileBuffer], { type: "image/jpeg" });

  console.log("Running removeBackground at full resolution...");
  const resultBlob = await removeBackground(inputBlob);
  const rawCutoutBuffer = Buffer.from(await resultBlob.arrayBuffer());

  const rawPath = path.resolve("public/samrudh-cutout-raw.png");
  fs.writeFileSync(rawPath, rawCutoutBuffer);
  console.log("Saved raw cutout to:", rawPath);

  const meta = await sharp(rawCutoutBuffer).metadata();
  console.log("Raw cutout dimensions:", meta.width, "x", meta.height);
}

main().catch(console.error);
