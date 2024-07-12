// 批量搜索 md 的内容
import { readMarkdownPosts } from "./utils.js";

async function run() {
  const posts = await readMarkdownPosts();
  posts.forEach(({ metadata, content }) => {
    // write code here...
    console.log(metadata);
    console.log(content);
  });
}

run();
