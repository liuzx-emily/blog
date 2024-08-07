import { watch } from "node:fs";
import {
  generateDataCategories,
  generateDataPosts,
  gererateAssets,
} from "../generate-data/generate-data-helpers.js";
import { _getPath, debounce } from "../utils.js";
import { createViteServer, triggerReload } from "./vite-server.js";

async function run() {
  const server = await createViteServer();

  await generateDataCategories();
  await generateDataPosts({ includeDrafts: true });
  await gererateAssets();

  /* 
    debounce 是为了优化性能，但也是不得已而为之：
      用 vscode 修改 post.md 时，每次保存都会连续触发两次 watchListener，原因未明。
      起先怀疑是因为 vscode 的 format on save，但是关闭了 format on save 和 eslint fix on save 后，保存还是会触发两次。
      用 txt 修改 post.md 时，保存只会触发一次。
    连续触发的第二次 listener 必定报错：fs.cp 目标文件不存在。不知道为什么会报这个错误，推测和文件被占用有关。
   */
  const postsChangeHandler = debounce(async () => {
    await generateDataPosts({ includeDrafts: true });
    triggerReload(server, false, "build-static-html/data/posts.js");
  }, 100);

  const categoriesChangeHandler = debounce(async () => {
    await generateDataCategories();
    triggerReload(server, false, "build-static-html/data/categories.js");
  }, 100);

  const assetsChangeHandler = debounce(async () => {
    await gererateAssets();
    // assets 放在 public 中，需要 full-reload
    triggerReload(server, true);
  }, 100);

  console.log("---开始监听---");

  watch(_getPath("src/posts"), async (eventType, filename) => {
    console.log(`检测到 ${filename} 文件 ${eventType}！`);
    postsChangeHandler();
  });

  watch(_getPath("src/categories.js"), async (eventType) => {
    console.log(`检测到分类文件 ${eventType}！`);
    categoriesChangeHandler();
  });

  watch(_getPath("src/post-assets"), async (eventType, filename) => {
    console.log(`检测到 ${filename} 文件 ${eventType}！`);
    assetsChangeHandler();
  });
}

try {
  run();
} catch (e) {
  console.error(e);
  // eslint-disable-next-line no-debugger
  debugger;
}
