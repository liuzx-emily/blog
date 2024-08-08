export function useSeries(posts) {
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
