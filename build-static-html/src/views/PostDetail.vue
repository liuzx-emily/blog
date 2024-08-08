<script setup>
import { inject, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PostCategory from "../components/PostCategory.vue";
import PostDate from "../components/PostDate.vue";
import PostTag from "../components/PostTag.vue";
import { useSeries } from "../composable/useSeries";

const router = useRouter();
const route = useRoute();

const posts = inject("posts");
const { seriesMap } = useSeries(posts);
const postId = route.params.id;
const post = posts.find((post) => post.id === postId);
let postsInTheSameSeries;
if (post.series) {
  postsInTheSameSeries = seriesMap.get(post.series);
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
  toc.value = [...document.querySelectorAll("#content h2,h3,h4")].map((el) => {
    return {
      text: el.innerText,
      level: parseInt(el.tagName.slice(1)),
    };
  });
});
function clickToc(index) {
  const el = document.querySelectorAll("#content h2,h3,h4")[index];
  el.scrollIntoView({ behavior: "smooth" });
}

const activeLeftPanel = ref(["series", "toc"]);
</script>

<template>
  <div class="post-detail-side-column pretty-scroll">
    <a-collapse v-model:activeKey="activeLeftPanel" expand-icon-position="end" ghost2>
      <a-collapse-panel key="series" :header="'系列：' + post.series" v-if="post.series">
        <div class="post-series-container">
          <div v-for="seriesPost in postsInTheSameSeries" :key="seriesPost.id" class="series-post">
            <router-link
              v-if="seriesPost.id !== post.id"
              :to="'/post/' + seriesPost.id"
              target="_blank"
              class="another-post"
            >
              <span v-if="seriesPost.draft" style="color: #ef6c00">[草稿]</span
              >{{ seriesPost.title }}
            </router-link>
            <div v-else class="current-post">
              <span v-if="seriesPost.draft" style="color: #ef6c00">[草稿]</span>{{ post.title }}
            </div>
          </div>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="toc" header="目录" v-if="toc.length > 0">
        <div class="post-toc-container">
          <div
            class="post-toc"
            v-for="(o, index) in toc"
            :key="index"
            :data-level="o.level"
            :title="o.text"
            @click="clickToc(index)"
          >
            {{ o.text }}
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
  <div class="post-detail-container">
    <router-link to="/" class="back-to-homepage">返回主页</router-link>
    <div id="title">
      <span v-if="post.draft" style="color: #ef6c00">[草稿]</span>
      {{ post.title }}
    </div>
    <div class="post-info-container">
      <PostDate :val="post.createTime" />
      <div class="post-categories-box" v-if="post.categories.length > 0">
        <span class="label">分类：</span>
        <PostCategory
          v-for="category in post.categories"
          :key="category"
          @click="clickCategory(category)"
          :category="category"
        />
      </div>
      <div class="post-series-box" v-if="post.series">
        <span class="label">系列：</span>
        <PostSeries @click="clickSeries(post.series)" :series="post.series" />
      </div>
      <div class="post-tags-box" v-if="post.tags.length > 0">
        <span class="label">标签：</span>
        <PostTag v-for="tag in post.tags" :key="tag" :tag="tag" @click="clickTag(tag)"></PostTag>
      </div>
    </div>
    <div class="post-description" v-if="post.description">{{ post.description }}</div>
    <div id="content" v-html="post.content"></div>
  </div>
</template>

<style scoped lang="scss">
$side-column-width: 250px;
$post-detail-container-width: 800px;
$app-gap-width: 20px;

.post-detail-side-column {
  $top: 20px;
  position: fixed;
  width: $side-column-width;
  left: calc(
    (100% - #{$post-detail-container-width}) / 2 - #{$side-column-width} - #{$app-gap-width}
  );
  top: $top;
  max-height: calc(100vh - #{$top}* 2);
  overflow: auto;
  margin-right: $app-gap-width;
  background: white;
  border-radius: 4px;
  .post-series-container {
    .series-post {
      font-size: 14px;
      line-height: 20px;
      margin: 8px 0;
      .another-post,
      .current-post {
        color: #333;
        &::before {
          content: "●";
          margin-right: 6px;
        }
      }
      .another-post {
        &::before {
          color: #2196f3;
        }
      }
      .current-post {
        &::before {
          color: #ccc;
        }
      }
      .another-post:hover {
        transition: color 0s;
        color: #2196f3;
        text-decoration: underline;
      }
    }
  }
  .post-toc-container {
    .post-toc {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      color: #333;
      &:hover {
        background-color: #eff4f5;
      }
    }
    .post-toc[data-level="2"] {
      padding-left: 10px;
      font-size: 14px;
      line-height: 34px;
    }
    .post-toc[data-level="3"] {
      padding-left: 30px;
      font-size: 14px;
      line-height: 34px;
    }
    .post-toc[data-level="4"] {
      padding-left: 54px;
      font-size: 13px;
      line-height: 32px;
    }
  }
}
.post-detail-container {
  margin: 0 auto;
  box-sizing: border-box;
  width: $post-detail-container-width;
  padding: 20px;
  min-height: 100vh;
  background: white;
  .back-to-homepage {
    color: #34538b;
    font-size: 13px;
    display: inline-block;
    margin-bottom: 10px;
  }
  #title {
    font-size: 26px;
    word-wrap: break-word;
    color: #222;
    font-weight: 600;
    word-break: break-all;
  }

  #content:deep() {
    font-size: 14px;
    color: #333;
    margin-top: 20px;
    border-top: 1px solid #ddd;
    padding-top: 20px;
    h2 {
      background: #eff4f5;
      padding: 10px 0 10px 12px;
      margin: 0 0;
    }
    h5 {
      font-size: 14px;
      margin: 16px 0;
    }
    h6 {
      font-size: 14px;
      margin: 10px 0;
    }
    p {
      line-height: 22px;
      margin: 10px 0;
    }
    img {
      max-width: 100%;
    }

    hr {
      margin: 35px 0;
      border: none;
      border-bottom: 1px solid #ddd;
    }

    blockquote {
      background: #f5f5f5;
      margin: 0;
      padding: 1px 20px;
    }

    a {
      color: #2196f3;
    }
    ul,
    ol {
      padding-left: 20px;
    }
    ul > li {
      list-style: circle;
    }
    li {
      line-height: 22px;
      margin: 2px 0;
    }
    table {
      border-collapse: collapse;
      th {
        background-color: #eff3f5;
      }
      th,
      td {
        border: 1px solid #ddd;
        padding: 8px;
      }
    }
    p > code,
    li > code {
      padding: 1px 4px;
      background: #f9f2f4;
      color: #c7254e;
      word-break: break-all;
    }
    pre {
      background-color: #f5f7ff;
      padding: 8px;
      color: #555;
      font-family: Source Code Pro;
      overflow-x: auto;
      .hljs-comment {
        font-size: 13px;
        color: #9e9e9e;
      }
      .hljs-keyword {
        color: #6679cc;
      }
      .function_ {
        color: #3d8fd1;
      }
      .hljs-string {
        color: #ac9739;
      }
      .hljs-number,
      .hljs-attr,
      .hljs-regexp {
        color: #ac9739;
      }
      .hljs-subst {
        color: #ac3939;
      }
    }
    pre.language-html {
      .hljs-tag > .hljs-name {
        color: #c94922;
      }
    }
  }
}
</style>
