<script setup>
import PostCategory from "./PostCategory.vue";
import PostDate from "./PostDate.vue";
import PostSeries from "./PostSeries.vue";
import PostTag from "./PostTag.vue";

defineProps({
  post: { require: true },
});

const emit = defineEmits(["click-category", "click-series", "click-tag"]);
</script>

<template>
  <div class="post-info-item">
    <div class="post-title">
      <router-link :to="'/post/' + post.id">
        <span v-if="post.draft" style="color: #ef6c00">[草稿]</span>
        {{ post.title }}
      </router-link>
    </div>
    <div class="post-metadata-container">
      <PostDate :val="post.createTime" />
      <div v-if="post.categories.length > 0">
        <span class="label">分类：</span>
        <PostCategory
          v-for="category in post.categories"
          :key="category"
          @click="emit('click-category', category)"
          :category="category"
        />
      </div>
      <div v-if="post.series">
        <span class="label">系列：</span>
        <PostSeries @click="emit('click-series', post.series)" :series="post.series" />
      </div>
      <div v-if="post.tags.length > 0">
        <span class="label">标签：</span>
        <PostTag
          v-for="tag in post.tags"
          :key="tag"
          :tag="tag"
          @click="emit('click-tag', tag)"
        ></PostTag>
      </div>
    </div>
    <div class="post-description" v-if="post.description">{{ post.description }}</div>
  </div>
</template>
<style lang="scss" scoped>
.post-info-item {
  display: flex;
  row-gap: 8px;
  flex-direction: column;
  .post-title {
    font-size: 16px;
    font-weight: 800;
    color: #333;
    word-wrap: break-word;
    word-break: break-all;
    a {
      display: block;
      text-decoration: none;
      color: initial;
    }
  }

  .post-metadata-container {
    display: flex;
    gap: 0 15px;
    align-items: baseline;
    font-size: 13px;
    .label {
      color: #888;
    }
    .post-category + .post-category,
    .post-tag + .post-tag {
      margin-left: 8px;
    }
  }
  .post-description {
    font-size: 13px;
    line-height: 1.5;
    color: #999;
  }
}
</style>
