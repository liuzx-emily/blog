export function useTags(posts) {
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

  return { tagsList };
}
