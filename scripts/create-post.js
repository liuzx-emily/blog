import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { _getPath, dateFormat } from "./utils.js";

// 新建文章
function run() {
  const postId = uuidv4();
  const createTime = dateFormat(new Date(), "yyyy-MM-dd");
  const metadata = {
    id: postId,
    title: "TODO",
    createTime,
    updateTime: "",
    categories: "",
    tags: "",
    description: "",
    draft: 1,
  };
  let metadataStr = `---\n`;
  for (const key in metadata) {
    const value = metadata[key];
    metadataStr += `${key}: ${value}\n`;
  }
  metadataStr += "---\n";
  const filename = `${createTime}_${postId.slice(0, 5)}.md`;
  const mdContent = "正文";
  writeFile(_getPath(`src/posts/${filename}`), metadataStr + mdContent);
}

run();
