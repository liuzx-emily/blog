// 寻找在markdown中引用但不存在的图片；寻找未使用的图片并自动删除
import { readdir, rm } from "fs/promises";
import { JSDOM } from "jsdom";
import path from "path";
import { checkAndGetLocalAssetName, readMarkdownPosts } from "./helpers.js";
import { _getPath, createConverter } from "./utils.js";

const converter = createConverter();

async function run() {
  const localAssets = await readdir(_getPath("src/post-assets"));
  const localAssetUsedInPosts = [];
  const posts = await readMarkdownPosts();
  posts.forEach(({ metadata, content }) => {
    let htmlContent = converter.makeHtml(content);
    const dom = new JSDOM(htmlContent);
    const doc = dom.window.document;
    doc.querySelectorAll("img").forEach((img) => {
      checkAsset(img.getAttribute("src"), metadata.title);
    });
    doc.querySelectorAll("a").forEach((link) => {
      checkAsset(link.getAttribute("href"), metadata.title);
    });
  });
  localAssets.forEach(async (asset) => {
    if (localAssetUsedInPosts.indexOf(asset) === -1) {
      await rm(path.join(_getPath("src/post-assets"), asset));
      console.warn(`本地资源${asset}未使用，已自动删除。`);
    }
  });

  function checkAsset(assetPath, title) {
    const localAssetName = checkAndGetLocalAssetName(assetPath);
    if (!localAssetName) {
      // 不是本地资源
      return;
    }
    localAssetUsedInPosts.push(localAssetName);
    if (localAssets.indexOf(localAssetName) === -1) {
      console.warn(`《${title}》中的资源${localAssetName}不存在，请及时处理！`);
    }
  }
}

run();
