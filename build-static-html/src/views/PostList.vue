<script setup>
import { CloseSquareOutlined } from "@ant-design/icons-vue";
import { computed, inject, ref } from "vue";
import { useRoute } from "vue-router";
import PostCategory from "../components/PostCategory.vue";
import PostDate from "../components/PostDate.vue";
import PostSeries from "../components/PostSeries.vue";
import PostTag from "../components/PostTag.vue";
import { useCategories } from "../composable/useCategories";
import { useSeries } from "../composable/useSeries";
import { useTags } from "../composable/useTags";
import { cloneDeep } from "../utils.js";

const route = useRoute();

const posts = inject("posts");
const { categories } = useCategories(posts);
const { seriesList } = useSeries(posts);
const { tagsList } = useTags(posts);

const category = ref();
const series = ref();
const tag = ref();

category.value = route.query.category;
series.value = route.query.series;
tag.value = route.query.tag;

let filteredPosts = computed(() => {
  let res = cloneDeep(posts);
  if (category.value) {
    if (category.value === "未分类") {
      res = res.filter((post) => post.categories.length === 0);
    } else {
      res = res.filter((post) => post.categories.includes(category.value));
    }
  }
  if (series.value) {
    res = res.filter((post) => series.value === post.series);
  }
  if (tag.value) {
    res = res.filter((post) => post.tags.includes(tag.value));
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

function clickTag(val) {
  tag.value = val;
}
function clickCategory(val) {
  category.value = val;
}
function clickSeries(val) {
  series.value = val;
}

function selectTreeNode(selected) {
  if (selected.length === 0) {
    category.value = "";
  } else {
    category.value = selected[0];
  }
}

const activeLeftPanel = ref(["categories", "series", "tags"]);

document.title = "博客";
</script>

<template>
  <div class="app-left pretty-scroll">
    <a-collapse v-model:activeKey="activeLeftPanel" expand-icon-position="end" ghost2>
      <a-collapse-panel key="categories" header="分类">
        <a-tree
          :default-expand-all="true"
          :tree-data="categories"
          :fieldNames="{ children: 'children', title: 'name', key: 'name' }"
          @select="selectTreeNode"
        >
          <template #title="{ name, count }">{{ name }} ({{ count }})</template>
        </a-tree>
      </a-collapse-panel>
      <a-collapse-panel key="series" header="系列">
        <div class="seriesList">
          <div v-for="series in seriesList" :key="series" class="series">
            <span class="series-name" @click="clickSeries(series.name)">{{ series.name }}</span>
            <span class="series-count"> ({{ series.posts.length }}) </span>
          </div>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="tags" header="标签">
        <div class="tags">
          <PostTag
            v-for="tag in tagsList"
            :key="tag.name"
            :tag="tag.name"
            @click="clickTag(tag.name)"
          >
            {{ tag.name }}
            <span class="tag-count" v-if="tag.count > 1"> ({{ tag.count }}) </span>
          </PostTag>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
  <div class="app-right">
    <div v-if="category || series || tag" class="sticky-filters">
      <span v-if="category" style="margin-right: 18px">
        分类：{{ category }}
        <CloseSquareOutlined style="cursor: pointer" @click="category = ''" />
      </span>
      <span v-if="series" style="margin-right: 18px">
        系列：{{ series }}
        <CloseSquareOutlined style="cursor: pointer" @click="series = ''" />
      </span>
      <span v-if="tag">
        标签：{{ tag }}
        <CloseSquareOutlined style="cursor: pointer" @click="tag = ''" />
      </span>
    </div>
    <ul style="padding: 0 24px">
      <li v-for="post in filteredPosts" :key="post.id" class="post-item">
        <div class="post-title">
          <router-link :to="'/post/' + post.id">
            <span v-if="post.draft" style="color: #ef6c00">[草稿]</span>
            {{ post.title }}
          </router-link>
        </div>
        <div class="post-description" v-if="post.description">{{ post.description }}</div>
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
            <PostTag
              v-for="tag in post.tags"
              :key="tag"
              :tag="tag"
              @click="clickTag(tag)"
            ></PostTag>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
$app-left-width: 280px;
$app-right-width: 800px;
$app-gap-width: 20px;

.app-left {
  position: fixed;
  width: $app-left-width;
  left: calc((100% - #{$app-left-width} - #{$app-right-width} - #{$app-gap-width}) / 2);
  top: 0;
  bottom: 0;
  overflow: auto;
  margin-right: $app-gap-width;
  background: white;
  .category-name {
    cursor: pointer;
    font-size: 13px;
    line-height: 23px;
  }
  .seriesList {
    .series {
      line-height: 26px;
      .series-name {
        color: #333;
        cursor: pointer;
      }
      .series-count {
        color: #b77309;
      }
    }
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    .post-tag {
      margin-bottom: 10px;
      padding: 0 3px;
      color: #445a64;
      background: #f6f7f6;
      outline: 1px solid #dcdddd;
      .tag-count {
        color: #b77309;
      }
    }
  }
}
.app-right {
  margin-left: calc((100% - #{$app-right-width} + #{$app-left-width} + #{$app-gap-width}) / 2);
  width: $app-right-width;
  background: white;
  .sticky-filters {
    position: sticky;
    top: 0px;
    font-size: 15px;
    padding: 16px 20px;
    background: #e9f0f3;
    color: rgb(33, 53, 68);
    border-bottom: 1px solid #beccd3;
  }
  ul {
    margin: 0;
    padding: 0;
  }
  .post-item {
    list-style: none;
    padding: 24px 0;
    border-bottom: 1px solid #ddd;
    a {
      display: block;
      text-decoration: none;
      color: initial;
    }
  }
  .post-title {
    font-size: 16px;
    font-weight: 800;
    line-height: 24px;
    color: #333;
    & > span {
      cursor: pointer;
    }
  }
}
</style>
