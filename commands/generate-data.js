import commandLineArgs from "command-line-args";
import { JSDOM } from "jsdom";
import { watch } from "node:fs";
import { cp, writeFile } from "node:fs/promises";
import Showdown from "showdown";
import ShowdownHighlight from "showdown-highlight";
import { _getPath, readMarkdownPosts, walkThroughTree } from "./utils.js";
import { categories } from "../src/categories.js";

const args = commandLineArgs([{ name: "dev", type: Boolean }]);

const flattenedCategories = [];
walkThroughTree(categories, (category) => {
  flattenedCategories.push(category.name);
});

const converter = new Showdown.Converter({
  extensions: [
    ShowdownHighlight({
      pre: true, // Whether to add the classes to the <pre> tag, default is false
      auto_detection: true, // Whether to use hljs' auto language detection, default is true
    }),
  ],
});

async function run() {
  try {
    await generateDataCategories();
    await generateDataPosts();
    await gererateAssets();
    if (args.dev) {
      watch(_getPath("src/posts"), async (eventType, filename) => {
        console.log(`检测到 ${filename} 文件 ${eventType}！`);
        await generateDataPosts();
      });
      watch(_getPath("src/categories.js"), async (eventType) => {
        console.log(`检测到分类文件 ${eventType}！`);
        await generateDataPosts();
      });
      watch(_getPath("src/post-assets"), async (eventType, filename) => {
        console.log(`检测到 ${filename} 文件 ${eventType}！`);
        await gererateAssets();
      });
    }
  } catch (error) {
    console.error(error);
  }
}

async function generateDataCategories() {
  await cp(_getPath("src/categories.js"), _getPath("build-static-html/data/categories.js"));
  console.log("生成 data/categories.js");
}

async function generateDataPosts() {
  console.log("读取 markdown posts 中...");
  let posts = await readMarkdownPosts();
  if (!args.dev) {
    // 在非dev模式中，不显示草稿文章
    posts = posts.filter(({ metadata }) => metadata.draft !== "1");
  }
  posts = posts.map(({ metadata, content }) => {
    let htmlContent = converter.makeHtml(content);
    // change image src
    const dom = new JSDOM(htmlContent);
    const doc = dom.window.document;
    doc.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src"); // "..\\post-assets\\d8254493-7b2e-410e-bd40-236711f2b884.png"
      const [imageName, imgNameWithoutSuffix, suffix] = src.match(/([^\\]+)\.([^\.]+)$/);
      const newSrc = `\\liuzx-emily\\post-assets\\${imageName}`;
      img.setAttribute("src", newSrc);
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
    if (args.dev) {
      res.draft = metadata.draft === "1";
    }
    return res;
  });
  await writeFile(
    _getPath("build-static-html/data/posts.js"),
    `export const posts = ${JSON.stringify(posts)};`
  );
  console.log("生成 data/posts.js");
}

async function gererateAssets() {
  // await rm(_getPath("build-static-html/public/post-assets"), { recursive: true });
  await cp(_getPath("src/post-assets"), _getPath("build-static-html/public/post-assets"), {
    recursive: true,
    force: true,
  });
  console.log("复制 post-assets");
}

run();
