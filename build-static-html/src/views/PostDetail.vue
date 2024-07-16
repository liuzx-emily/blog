<script setup>
import { inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import PostCategory from "../components/PostCategory.vue";
import PostDate from "../components/PostDate.vue";
import PostTag from "../components/PostTag.vue";

const router = useRouter();
const route = useRoute();

const posts = inject("posts");

const postId = route.params.id;
const post = posts.find((post) => post.id === postId);
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
</script>

<template>
  <div class="wrapper">
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
.wrapper {
  width: 800px;
  margin: 0 auto;
  min-height: 100vh;
  box-sizing: border-box;
  background: white;
  padding: 20px;
  box-sizing: border-box;
}
#title {
  font-size: 26px;
  word-wrap: break-word;
  color: #222;
  font-weight: 600;
  word-break: break-all;
}

.post-description {
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

#content:deep() {
  font-size: 14px;
  color: #333;
  img {
    display: block;
    max-width: 100%;
  }

  hr {
    margin: 35px 0;
    border: 1px solid #eee;
  }

  blockquote {
    background: #f5f5f5;
    margin: 0;
    padding: 1px 20px;
  }

  a {
    color: #2196f3;
  }

  ul > li {
    list-style: circle;
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
  p > code {
    padding: 1px 4px;
    background: #f9f2f4;
    color: #c7254e;
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
  }
  pre.language-html {
    .hljs-tag > .hljs-name {
      color: #c94922;
    }
  }
}
</style>
