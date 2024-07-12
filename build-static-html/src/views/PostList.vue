<script setup>
import { CloseSquareOutlined } from "@ant-design/icons-vue";
import { computed, inject, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PostCategory from "../components/PostCategory.vue";
import PostDate from "../components/PostDate.vue";
import PostTag from "../components/PostTag.vue";
import { useTags } from "../composable/useTags";
import { useCategories } from "../composable/useCategories";
import { cloneDeep } from "../utils.js";

const router = useRouter();
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

function clickPost(post) {
  router.push(`/post/${post.id}`);
}

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
</script>

<template>
  <div class="wrapper">
    <div class="app-left">
      <div class="sticky-content">
        <div class="categories-container">
          <a-tree
            :default-expand-all="false"
            :tree-data="categories"
            :fieldNames="{ children: 'children', title: 'name', key: 'name' }"
            @select="selectTreeNode"
          >
            <template #title="{ name, count }"> {{ name }} ({{ count }}) </template>
          </a-tree>
        </div>
        <div class="tags-container">
          <div class="tags">
            <PostTag
              v-for="tag in tagsList"
              :key="tag.name"
              :tag="tag.name"
              @click="clickTag(tag.name)"
            >
              {{ tag.name }}({{ tag.count }})
            </PostTag>
          </div>
        </div>
      </div>
    </div>
    <div class="app-right">
      <div
        v-if="category || tag"
        style="
          position: sticky;
          top: 0px;
          background: rgb(225 225 225);
          padding: 16px 20px;
          color: rgb(33 53 68);
          font-size: 15px;
        "
      >
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
            <span @click="clickPost(post)">{{ post.title }}</span>
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
<style scoped>
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
  padding: 20px;
  box-sizing: border-box;
  .sticky-content {
    position: sticky;
    top: 20px;
  }

  .categories-container {
    padding-bottom: 20px;
    border-bottom: 1px solid #ddd;
  }

  .category-name {
    cursor: pointer;
    font-size: 13px;
    line-height: 23px;
  }

  .tags-container {
    padding-top: 20px;
    .tags {
      display: flex;
      flex-wrap: wrap;
      .post-tag {
        cursor: pointer;
        margin-bottom: 10px;
      }
    }
  }
}

.app-right {
  flex: 1;
  background: white;
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
