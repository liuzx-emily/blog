// 寻找在markdown中引用但不存在的图片；寻找未使用的图片并自动删除
import { readdir, rm } from "fs/promises";
import { JSDOM } from "jsdom";
import path from "path";
import { readMarkdownPosts } from "./helpers.js";
import { _getPath, createConverter } from "./utils.js";

const converter = createConverter();

async function run() {
  const assets = await readdir(_getPath("src/post-assets"));
  const assetUsedInPosts = [];
  const posts = await readMarkdownPosts();
  posts.forEach(({ metadata, content }) => {
    let htmlContent = converter.makeHtml(content);
    const dom = new JSDOM(htmlContent);
    const doc = dom.window.document;
    doc.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src"); // "../post-assets/d8254493-7b2e-410e-bd40-236711f2b884.png"
      const [imageName] = src.match(/[^/]+$/); // "d8254493-7b2e-410e-bd40-236711f2b884.png"
      assetUsedInPosts.push(imageName);
      if (assets.indexOf(imageName) === -1) {
        console.warn(`《${metadata.title}》中的图片${imageName}不存在，请及时处理！`);
      }
    });
  });
  assets.forEach(async (asset) => {
    if (assetUsedInPosts.indexOf(asset) === -1) {
      await rm(path.join(_getPath("src/post-assets"), asset));
      console.warn(`图片${asset}未使用，已自动删除。`);
    }
  });
}

run();
