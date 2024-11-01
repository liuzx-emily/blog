import { readdir } from "fs/promises";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { _getPath } from "./utils.js";

export async function readMarkdownPosts() {
  const mdDirPath = _getPath("src/posts");
  const files = await readdir(mdDirPath);
  const posts = [];
  for (const mdFileName of files) {
    const mdPath = path.join(mdDirPath, mdFileName);
    const { metadata, content } = await analyzeMd(mdPath);
    posts.push({ metadata, content, mdFileName });
  }
  return posts;
}

async function analyzeMd(mdPath) {
  const fileStream = fs.createReadStream(mdPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  let lines = [];
  for await (const line of rl) {
    lines.push(line);
  }
  let metadata_lines = [];
  let content_lines = [];
  const metadata_startline = lines.indexOf("---");
  lines = lines.slice(metadata_startline + 1);
  const metadata_endline = lines.indexOf("---");
  metadata_lines = lines.slice(0, metadata_endline);
  content_lines = lines.slice(metadata_endline + 1);
  const metadata = metadata_lines
    .filter((l) => l)
    .reduce((acc, cur) => {
      const { key, value } = analyzeMetadata(cur);
      acc[key] = value;
      return acc;
    }, {});
  const content = content_lines.join("\n");
  return {
    metadata,
    content,
  };
}

// 虽然 md 中规定的 metadata 格式是 [name]: [value]。但是当 value 为空时，vscode在保存时会自动格式化，去掉冒号后面的空格。
function analyzeMetadata(metadataStr) {
  const index = metadataStr.indexOf(":");
  const key = metadataStr.slice(0, index);
  let value;
  if (metadataStr.length === index + 1) {
    value = "";
  } else {
    value = metadataStr.slice(index + 2);
  }
  return { key, value };
}

const postAssetReg = /^\.\.\/post-assets\/([^/]+)$/;

// 判断路径是否为本地资源路径，是则返回资源名称；不是返回false
export function checkAndGetLocalAssetName(path) {
  // ../post-assets/[asset-name]
  const match = path.match(postAssetReg);
  if (!match) {
    return false;
  }
  return match[1]; // match[1] 为 [asset-name]
}
