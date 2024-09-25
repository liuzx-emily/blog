import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { posts, seriesMap } from "../../store";

export function usePostDetail() {
  const router = useRouter();
  const route = useRoute();

  const postId = route.params.id;
  const post = posts.find((post) => post.id === postId);
  let postsInTheSameSeries;
  if (post.series) {
    postsInTheSameSeries = seriesMap.get(post.series).map((seriesPost) => {
      /* 将同系列文章的标题简化：
        [系列名称]xxx -> xxx
        [系列名称：]xxx -> xxx
      */
      if (seriesPost.title === post.series) {
        seriesPost.briefTitle = seriesPost.title;
      } else {
        seriesPost.briefTitle = seriesPost.title.replace(new RegExp(`^${post.series}(：)*`), "");
      }
      seriesPost.isCurrentPost = seriesPost.id === post.id;
      return seriesPost;
    });
  }

  document.title = post.title;

  function clickCategory(category) {
    router.push({
      name: "index",
      query: { category },
    });
  }
  function clickTag(tag) {
    router.push({
      name: "index",
      query: { tag },
    });
  }
  function clickSeries(series) {
    router.push({
      name: "index",
      query: { series },
    });
  }

  // table of content
  let toc = ref([]);
  onMounted(() => {
    // 目录中只显示 h2-h4（内容中不允许出现h1。内容中允许出现h5 h6，但不显示在目录中
    toc.value = [...document.querySelectorAll("#post-content h2,h3,h4")].map((el) => {
      return {
        text: el.innerText,
        level: parseInt(el.tagName.slice(1)),
      };
    });
  });
  function clickToc(index) {
    const el = document.querySelectorAll("#post-content h2,h3,h4")[index];
    el.scrollIntoView({ behavior: "smooth" });
  }

  onMounted(() => {
    // 注意：我并不确定在哪个 hook 里能确保 v-html 中的内容渲染完毕，先放在 mounted 里吧。
    if (route.query.headerId) {
      const scrollTarget = document.querySelector("#" + route.query.headerId);
      if (scrollTarget) {
        // 页面加载后会触发一些未知来源的 scroll，如果不加 setTimeout 则会先执行我的 scroll，再触发那些未知 scroll，所以最终效果是滚到其他位置去了。
        // 找不到好的解决办法，姑且给我的 scroll 加一个 500ms 的延迟
        setTimeout(() => {
          scrollTarget.scrollIntoView({ behavior: "instant" });
        }, 500);
      }
    }
  });
  return {
    post,
    toc,
    postsInTheSameSeries,
    clickCategory,
    clickTag,
    clickSeries,
    clickToc,
  };
}
