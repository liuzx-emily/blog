// 批量修改 md 的内容。谨慎起见不修改 posts 中的文件，而是把修改后的内容输出到 batchModifyMdOutputs 中。确认结果无误后再自行替换。

import { mkdir, writeFile } from "node:fs/promises";
import { readMarkdownPosts } from "./helpers.js";
import { _getPath } from "./utils.js";

const outputPath = "batchModifyMdOutputs";

async function run() {
  mkdir(_getPath(outputPath));

  const posts = await readMarkdownPosts();
  posts.forEach(async ({ metadata, content, mdFileName }) => {
    // write code here...
    const newMetadata = metadata;
    const newContent = content;
    // 将新 metadata 和 content 拼装到一起
    let newMetadata_lines = [`---`];
    for (const key in newMetadata) {
      const value = newMetadata[key];
      newMetadata_lines.push(`${key}: ${value}`);
    }
    newMetadata_lines.push("---");
    const newWholeContent = newMetadata_lines.join("\n") + "\n" + newContent;
    await writeFile(_getPath(outputPath + "/" + mdFileName), newWholeContent);
  });
}

run();
