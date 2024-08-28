import { JSDOM } from "jsdom";
import { cp, writeFile } from "node:fs/promises";
import { baseUrl } from "../../config.js";
import { categories } from "../../src/categories.js";
import { readMarkdownPosts, checkAndGetLocalAssetName } from "../helpers.js";
import { _getPath, createConverter, walkThroughTree } from "../utils.js";

const flattenedCategories = [];
walkThroughTree(categories, (category) => {
  flattenedCategories.push(category.name);
});

const converter = createConverter();

export async function generateDataCategories() {
  await cp(_getPath("src/categories.js"), _getPath("build-static-html/data/categories.js"));
  console.log("已生成 data/categories.js");
}

export async function generateDataPosts({ includeDrafts = false } = {}) {
  console.log("读取 markdown posts 中...");
  let posts = await readMarkdownPosts();
  if (!includeDrafts) {
    // 在非dev模式中，不显示草稿文章
    posts = posts.filter(({ metadata }) => metadata.draft !== "1");
  }
  posts = posts.map(({ metadata, content }) => {
    let htmlContent = converter.makeHtml(content);
    // change image src
    const dom = new JSDOM(htmlContent);
    const doc = dom.window.document;
    doc.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      const correctedPath = correctPostAssetPath(src);
      if (correctedPath) {
        img.setAttribute("src", correctedPath);
      }
    });
    doc.querySelectorAll("a").forEach((el) => {
      const href = el.getAttribute("href");
      const correctedPath = correctLinkToAnotherPost(href) || correctPostAssetPath(href);
      if (correctedPath) {
        el.setAttribute("href", correctedPath);
        el.setAttribute("target", "_blank");
      }
    });
    htmlContent = doc.body.outerHTML;
    // 当检测到无效分类时，抛出错误提示，中止进程
    const categories = metadata.categories === "" ? [] : metadata.categories.split(", ");
    const invalidCategory = categories.find((category) => !flattenedCategories.includes(category));
    if (invalidCategory) {
      throw new Error(`《${metadata.title}》包含无效分类 - ${invalidCategory}`);
    }
    const res = {
      id: metadata.id,
      title: metadata.title,
      createTime: metadata.createTime,
      updateTime: metadata.updateTime,
      categories,
      tags: metadata.tags === "" ? [] : metadata.tags.split(", "),
      series: metadata.series,
      description: metadata.description,
      content: htmlContent,
    };
    if (includeDrafts) {
      res.draft = metadata.draft === "1";
    }
    return res;
  });
  await writeFile(
    _getPath("build-static-html/data/posts.js"),
    `export const posts = ${JSON.stringify(posts)};`
  );
  console.log("已生成 data/posts.js");
}

export async function gererateAssets() {
  // await rm(_getPath("build-static-html/public/post-assets"), { recursive: true });
  await cp(_getPath("src/post-assets"), _getPath("build-static-html/public/post-assets"), {
    recursive: true,
    force: true,
  });
  console.log("已复制 post-assets");
}

// 将资源路径 "../post-assets/[asset-name]" 转换为 "[baseUrl]/post-assets/[asset-name]"
function correctPostAssetPath(path) {
  const assetName = checkAndGetLocalAssetName(path);
  if (!assetName) {
    return;
  }
  const newPath = `${baseUrl}/post-assets/${assetName}`;
  return newPath;
}

/* 修改链接到另一篇文章的链接（这是我自定义的语法）
  将地址 "post:[postId]" 转换为 "[baseUrl]/#/post/[postId]"
  将地址 "post:[postId]#[headerId]" 转换为 "[baseUrl]/#/post/[postId]?headerId=[headerId]"
*/
function correctLinkToAnotherPost(path) {
  const re = /^post:([^#]+)(#([^#]+))?$/;
  const match = path.match(re);
  if (!match) {
    return;
  }
  // path 为 "post:foo" 时，match 为 ["post:foo", "foo", null, null]
  // path 为 "post:foo#bar" 时，match 为 ["post:foo#bar", "foo", "#bar", "bar"]
  const linkedPostId = match[1];
  let newPath = `${baseUrl}/#/post/${linkedPostId}`;
  const headerId = match[3];
  if (headerId) {
    newPath += `?headerId=${headerId} `;
  }
  return newPath;
}
