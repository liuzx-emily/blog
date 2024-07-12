import { categories } from "../../../src/categories";

export function useCategories(posts) {
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
  const res = [...categories];
  walkThroughTree(res, (node) => {
    if (categoriesAnalyzedFromPosts.has(node.name)) {
      const count = categoriesAnalyzedFromPosts.get(node.name);
      node.count = count;
      categoriesAnalyzedFromPosts.delete(node.name);
    } else {
      node.count = 0;
    }
  });
  categoriesAnalyzedFromPosts.forEach((count, name) => {
    console.warn(`错误分类《${name}》下有${count}篇文章，请处理`);
  });
  res.push({
    name: "未分类",
    count: uncategorized.length,
  });

  return {
    categories: res,
  };
}

function walkThroughTree(treeArr, cb) {
  for (let i = 0; i < treeArr.length; i++) {
    const element = treeArr[i];
    cb(element);
    if (element?.children?.length > 0) {
      walkThroughTree(element.children, cb);
    }
  }
}
