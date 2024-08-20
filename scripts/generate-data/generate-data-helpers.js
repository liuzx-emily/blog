import { JSDOM } from "jsdom";
import { cp, writeFile } from "node:fs/promises";
import { baseUrl } from "../../config.js";
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
  posts = posts.map(({ metadata, content }) => {
    let htmlContent = converter.makeHtml(content);
    // change image src
    const dom = new JSDOM(htmlContent);
    const doc = dom.window.document;
    doc.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src"); // "../post-assets/d8254493-7b2e-410e-bd40-236711f2b884.png"
      const [imageName] = src.match(/[^/]+$/);
      const newSrc = `${baseUrl}/post-assets/${imageName}`;
      img.setAttribute("src", newSrc);
    });
    doc.querySelectorAll("a").forEach((el) => {
      const href = el.getAttribute("href");
      /* 修改链接到另一篇文章的链接。有两种格式：
        - 普通："post:[postId]"，直接跳转到另一篇文章
        - 额外携带 headerId："post:[postId]#[headerId]"，跳转过去后 scroll 到指定 header
      */
      const re = /^post:([^#]+)(#([^#]+))?$/;
      const found = href.match(re);
      // href="post:foo" 时，found 为 ["post:foo", "foo", null, null]
      // href="post:foo#bar" 时，found 为 ["post:foo#bar", "foo", "#bar", "bar"]
      if (found) {
        const linkedPostId = found[1];
        let newHref = `${baseUrl}/#/post/${linkedPostId}`;
        const headerId = found[3];
        if (headerId) {
          newHref += `?headerId=${headerId} `;
        }
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
