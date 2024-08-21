import { categories as rawCategories } from "../data/categories";
import { posts as rawPosts } from "../data/posts";
import { cloneDeep, walkThroughTree } from "./utils";

// 脚本自动生成的数据放在 build-static-html/data 目录下，称为原始数据 raw data。
// 本文件是 website 应用的全局数据 store，将原始数据转换成应用需要的数据结构。
// website/src 中的代码需要数据时应该直接从本 store 获取，而**不是**从 build-static-html/data 获取。
const posts = getPosts();
const categories = getCategories(posts, rawCategories);
const { seriesList, seriesMap } = getSeries(posts);
const tagsList = getTags(posts);
const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

export { categories, posts, seriesList, seriesMap, tagsList, isMobile };

function getPosts() {
  return rawPosts;
}

function getCategories(posts, rawCategories) {
  const uncategorized = [];
  const categoriesAnalyzedFromPosts = posts.reduce((acc, cur) => {
    if (cur.categories.length === 0) {
      uncategorized.push(cur);
    }
    cur.categories.forEach((category) => {
      const count = acc.get(category) ?? 0;
      acc.set(category);
      acc.set(category, count + 1);
    });
    return acc;
  }, new Map());
  const res = cloneDeep(rawCategories);
  walkThroughTree(res, (node) => {
    if (categoriesAnalyzedFromPosts.has(node.name)) {
      const count = categoriesAnalyzedFromPosts.get(node.name);
      node.count = count;
    } else {
      node.count = 0;
    }
  });
  res.push({ name: "未分类", count: uncategorized.length });

  return res;
}

function getSeries(posts) {
  const seriesMap = posts.reduce((acc, cur) => {
    const series = cur.series;
    if (series) {
      const posts = acc.get(series) ?? [];
      posts.push({
        id: cur.id,
        title: cur.title,
        draft: cur.draft,
      });
      acc.set(series, posts);
    }
    return acc;
  }, new Map());

  const seriesList = [];
  seriesMap.forEach((posts, name) => {
    seriesList.push({ name, posts });
  });

  return { seriesList, seriesMap };
}

function getTags(posts) {
  const tagsMap = posts.reduce((acc, cur) => {
    cur.tags.forEach((tag) => {
      const count = acc.get(tag) ?? 0;
      acc.set(tag, count + 1);
    });
    return acc;
  }, new Map());

  const tagsList = [];
  tagsMap.forEach((count, name) => {
    tagsList.push({ name, count });
  });
  tagsList.sort((a, b) => {
    return b.count - a.count;
  });

  return tagsList;
}
