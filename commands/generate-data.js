import commandLineArgs from 'command-line-args';
import { JSDOM } from 'jsdom';
import { watch } from "node:fs";
import { cp, writeFile } from "node:fs/promises";
import Showdown from "showdown";
import ShowdownHighlight from "showdown-highlight";
import { _getPath, readMarkdownPosts } from "./utils.js";

const args = commandLineArgs([{ name: 'continuous-watch', type: Boolean }])

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
    if (args["continuous-watch"]) {
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
  posts = posts.map(({ metadata, content }) => {
    let htmlContent = converter.makeHtml(content);
    // change image src
    const dom = new JSDOM(htmlContent);
    const doc = dom.window.document;
    doc.querySelectorAll("img").forEach(img => {
      const src = img.getAttribute("src")  // "..\\post-assets\\d8254493-7b2e-410e-bd40-236711f2b884.png"
      const [imageName, imgNameWithoutSuffix, suffix] = src.match(/([^\\]+)\.([^\.]+)$/)
      const newSrc = `\\liuzx-emily\\post-assets\\${imageName}`
      img.setAttribute("src", newSrc)
    })
    htmlContent = doc.body.outerHTML

    return {
      id: metadata.id,
      title: metadata.title,
      createTime: metadata.createTime,
      updateTime: metadata.updateTime,
      categories: metadata.categories === "" ? [] : metadata.categories.split(", "),
      tags: metadata.tags === "" ? [] : metadata.tags.split(", "),
      description: metadata.description,
      content: htmlContent,
    };
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
