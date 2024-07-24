<script setup>
import { CloseSquareOutlined } from "@ant-design/icons-vue";
import { computed, inject, ref } from "vue";
import { useRoute } from "vue-router";
import PostCategory from "../components/PostCategory.vue";
import PostDate from "../components/PostDate.vue";
import PostTag from "../components/PostTag.vue";
import { useCategories } from "../composable/useCategories";
import { useTags } from "../composable/useTags";
import { cloneDeep } from "../utils.js";

const route = useRoute();

const posts = inject("posts");
const { categories } = useCategories(posts);
const { tagsList } = useTags(posts);

const tag = ref();
tag.value = route.query.tag;

// category
const category = ref();
category.value = route.query.category;

let filteredPosts = computed(() => {
  let res = cloneDeep(posts);
  if (category.value) {
    if (category.value === "未分类") {
      res = res.filter((post) => post.categories.length === 0);
    } else {
      res = res.filter((post) => post.categories.includes(category.value));
    }
  }
  if (tag.value) {
    res = res.filter((post) => post.tags.includes(tag.value));
  }
  res.sort((a, b) => {
    return +new Date(b.createTime) - +new Date(a.createTime);
  });
  return res;
});

function clickTag(val) {
  tag.value = val;
}
function clickCategory(val) {
  category.value = val;
}

function selectTreeNode(selected) {
  if (selected.length === 0) {
    category.value = "";
  } else {
    category.value = selected[0];
  }
}

const activeLeftPanel = ref(["categories"]);

document.title = "博客";
</script>

<template>
  <div class="wrapper">
    <div class="app-left">
      <div class="sticky-content">
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
    </div>

    <div class="app-right">
      <div v-if="category || tag" class="sticky-filters">
        <span v-if="category" style="margin-right: 18px">
          分类：{{ category }}
          <CloseSquareOutlined style="cursor: pointer" @click="category = ''" />
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
  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  box-sizing: border-box;
  width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
}
.app-left {
  background: white;
  flex: 0 0 280px;
  margin-right: 20px;

  box-sizing: border-box;
  .sticky-content {
    position: sticky;
    top: 0;
  }
  :deep(.ant-collapse) {
    border-radius: 0;
    .ant-collapse-item {
      border-radius: 0;
    }
    .ant-collapse-header {
      padding: 10px 16px;
    }
    .ant-collapse-content-box {
      padding: 10px 12px;
    }
  }
  :deep(.ant-tree) {
    .ant-tree-treenode {
      padding-bottom: 3px;
    }
  }
  .category-name {
    cursor: pointer;
    font-size: 13px;
    line-height: 23px;
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
  flex: 1;
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
