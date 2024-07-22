import { JSDOM } from "jsdom";
import { cp, writeFile } from "node:fs/promises";
import { categories } from "../../src/categories.js";
import { readMarkdownPosts } from "../helpers.js";
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
  // TODO 检测重复id
  posts = posts.map(({ metadata, content }) => {
    let htmlContent = converter.makeHtml(content);
    // change image src
    const dom = new JSDOM(htmlContent);
    const doc = dom.window.document;
    doc.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src"); // "../post-assets/d8254493-7b2e-410e-bd40-236711f2b884.png"
      const [imageName] = src.match(/[^/]+$/);
      const newSrc = `/liuzx-emily/post-assets/${imageName}`;
      img.setAttribute("src", newSrc);
    });
    // change link which is linked to another post
    doc.querySelectorAll("a").forEach((el) => {
      const href = el.getAttribute("href");
      const prefix = "post:";
      if (href.startsWith(prefix)) {
        const linkedPostId = href.slice(prefix.length);
        const newHref = `/liuzx-emily/#/post/${linkedPostId}`;
        el.setAttribute("href", newHref);
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
