import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { posts } from "../../store";
import { cloneDeep } from "../../utils.js";

export function usePostList() {
  const route = useRoute();
  const router = useRouter();

  const categoryFilter = ref();
  const seriesFilter = ref();
  const tagFilter = ref();

  router.isReady().then(() => {
    categoryFilter.value = route.query.category;
    seriesFilter.value = route.query.series;
    tagFilter.value = route.query.tag;
  });

  const filteredPosts = computed(() => {
    let res = cloneDeep(posts);
    if (categoryFilter.value) {
      if (categoryFilter.value === "未分类") {
        res = res.filter((post) => post.categories.length === 0);
      } else {
        res = res.filter((post) => post.categories.includes(categoryFilter.value));
      }
    }
    if (seriesFilter.value) {
      res = res.filter((post) => seriesFilter.value === post.series);
    }
    if (tagFilter.value) {
      res = res.filter((post) => post.tags.includes(tagFilter.value));
    }
    res.sort((a, b) => {
      const flag = +new Date(b.createTime) - +new Date(a.createTime);
      if (flag === 0) {
        // 同一天发布的文章按名称排序
        return b.title.localeCompare(a.title);
      } else {
        return flag;
      }
    });
    return res;
  });

  function changeTagFilter(val) {
    tagFilter.value = val;
  }
  function changeCategoryFilter(val) {
    categoryFilter.value = val;
  }
  function changeSeriesFilter(val) {
    seriesFilter.value = val;
  }

  document.title = "博客";

  return {
    categoryFilter,
    seriesFilter,
    tagFilter,
    changeCategoryFilter,
    changeSeriesFilter,
    changeTagFilter,
    filteredPosts,
  };
}
