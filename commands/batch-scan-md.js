// 批量搜索 md 的内容
import { mkdir } from "node:fs/promises";
import { _getPath, readMarkdownPosts } from "./utils.js";

const outputPath = "batchModifyMdOutputs";

async function run() {
  mkdir(_getPath(outputPath));
  const posts = await readMarkdownPosts();
  posts.forEach(({ metadata, content }) => {
    // write code here...
    console.log(metadata);
    console.log(content);
  });
}

run();
