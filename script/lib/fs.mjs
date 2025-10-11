import FS from "node:fs/promises";
import Path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = Path.dirname(fileURLToPath(import.meta.url));

/**
 * @param {string[]} path Relative to the root of the project.
 * Where we can find bith "lib/" and "doc/" forlders.
 */
export function absPath(...path) {
  return Path.resolve(__dirname, "../../images", ...path);
}

/**
 * @param {string} path
 * @returns {Promise<string[]>}
 */
export async function listFiles(path) {
  const files = await FS.readdir(path, { withFileTypes: true });
  return files
    .filter((f) => f.isFile())
    .map((f) => f.name)
    .filter((name) => !"._".includes(name.charAt(0)))
    .sort();
}

/**
 * @param {string} path
 * @returns {Promise<string[]>}
 */
export async function listFolders(path) {
  const files = await FS.readdir(path, { withFileTypes: true });
  return files
    .filter((f) => f.isDirectory())
    .map((f) => f.name)
    .filter((name) => !"._".includes(name.charAt(0)))
    .sort();
}

/**
 * Recursively create a directory if not exist.
 * @param {string} path
 * @returns The first directory path created
 */
export async function mkdir(path) {
    return await FS.mkdir(path, {
        recursive: true,
        mode: 0o700,
    })
}

/**
 *
 * @param {string} src
 * @param {string} dst
 */
export function copyFile(src, dst) {
  return FS.copyFile(src, dst);
}

/**
 * 
 * @param {string} src 
 * @param {string} dst 
 * @returns 
 */
export async function copyFolder(src, dst) {
    return await FS.cp(src, dst, {
        force: true,
        recursive: true
    })
}

/**
 *
 * @param {string} file
 * @param {string} extension - The extension without the leading dot.
 */
export function replaceExtension(file, extension) {
  const parts = file.split(".");
  parts.pop();
  parts.push(extension);
  return parts.join(".");
}

/**
 * @param {string} file 
 * @returns {string}
 */
export function removeExtension(file) {
  const parts = file.split(".");
  parts.pop();
  return parts.join(".");
}

/**
 *
 * @param {string} src
 * @param {string} dst
 * @returns {Promise<boolean>} `true` if `dst` exists and is younger than `src`.
 */
export async function isUptodate(src, dst) {
  try {
    const statSrc = await FS.stat(src);
    const statDst = await FS.stat(dst);

    return statDst.mtime >= statSrc.mtime;
  } catch {
    return false;
  }
}

/**
 * 
 * @param {string} file 
 * @param {string} content 
 * @returns 
 */
export async function writeText(file, content) {
    return await FS.writeFile(file, content)
}