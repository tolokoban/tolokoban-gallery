import sharp from "sharp";
import {
  absPath,
  copyFile,
  copyFolder,
  isUptodate,
  listFiles,
  listFolders,
  mkdir,
  removeExtension,
  replaceExtension,
  writeText,
} from "./lib/fs.mjs";

/**
 *
 * @param {string} file
 * @returns
 */
function hasExpectedExtension(file) {
  const expectedExtensions = [".jpg", ".png", ".jpeg"];
  for (const extension of expectedExtensions) {
    if (file.endsWith(extension)) return true;
  }
  return false;
}

async function start() {
  await mkdir(absPath("..", "build", "img"));
  console.log("Copying HTML files...");
  await copyFolder(absPath("..", "public"), absPath("..", "build"));
  /**
   * @type {string[]} list
   */
  const list = [];
  const files = await listFiles(absPath("."));
  for (const file of files) {
    if (!hasExpectedExtension(file)) {
      console.warn("Unexpected extension for image:", file);
      continue;
    }

    const rx = /^[0-9]{6}\./g;
    if (!rx.test(file)) {
      const now = new Date();
      const year = `${now.getFullYear()}`.slice(2);
      const month = `${1 + now.getMonth()}`.padStart(2, "0");
      const day = `${now.getDate()}`.padStart(2, "0");
      console.error("Invalid nomenclature for image:", file);
      console.log("    Names must be prefixed with the date in YYMMDD format.");
      console.log(
        `    Example: "${year}${month}${day}.todays-masterpiece.jpg"`,
      );
      continue;
    }

    const date = new Date(
      2000 + parseInt(file.slice(0, 2), 10),
      parseInt(file.slice(2, 4), 10) - 1,
      parseInt(file.slice(4, 6), 10) - 1,
    );
    list.push(removeExtension(file));
    console.log(">", file);
    const src = absPath(file);
    const dst = absPath("..", "build", "img", replaceExtension(file, "webp"));
    if (await isUptodate(src, dst)) continue;

    const img = sharp(src);
    img
      .webp({
        alphaQuality: 0,
        quality: 80,
      })
      .toFile(dst, (err, info) => {
        if (err) {
          console.error("Unable to write WebP file:", dst);
          console.error(err);
        } else {
          console.log("    Converted into WebP image:", file);
          console.log("    Dimensions:", info.width, "×", info.height);
          console.log("    Size:", Math.ceil(info.size / 1024), "Kb");
          const scale = 300 / Math.min(info.width, info.height);
          const width = Math.ceil(scale * info.width);
          const height = Math.ceil(scale * info.height);
          img
            .resize({
              width,
              height,
            })
            .webp({ alphaQuality: 0, quality: 60 })
            .toFile(replaceExtension(dst, "thumbnail.webp"), (err, info) => {
              if (err) {
                console.error("Unable to write thumbnail file:", dst);
                console.error(err);
              } else {
                console.log("    Created the thumbnail:", file);
                console.log("    Dimensions:", info.width, "×", info.height);
                console.log("    Size:", Math.ceil(info.size / 1024), "Kb");
              }
            });
        }
      });
  }
  writeText(
    absPath("..","build", "list.js"),
    `var L=${JSON.stringify(list.reverse().join("/"))}.split("/");`,
  );
}

start();
