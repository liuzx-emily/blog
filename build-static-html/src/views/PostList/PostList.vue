<script setup>
import { CloseSquareOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";
import PostInfoItem from "../../components/PostInfoItem.vue";
import CategoriesTree from "./components/CategoriesTree.vue";
import SeriesList from "./components/SeriesList.vue";
import TagList from "./components/TagList.vue";
import { usePostList } from "./usePostList";

const {
  categoryFilter,
  seriesFilter,
  tagFilter,
  changeCategoryFilter,
  changeSeriesFilter,
  changeTagFilter,
  filteredPosts,
} = usePostList();

const activeLeftPanel = ref(["categories", "series", "tags"]);
</script>

<template>
  <div class="app-left pretty-scroll">
    <a-collapse v-model:activeKey="activeLeftPanel" expand-icon-position="end">
      <a-collapse-panel key="categories" header="分类">
        <CategoriesTree @select="changeCategoryFilter" />
      </a-collapse-panel>
      <a-collapse-panel key="series" header="系列">
        <SeriesList @select="changeSeriesFilter" />
      </a-collapse-panel>
      <a-collapse-panel key="tags" header="标签">
        <TagList @select="changeTagFilter" />
      </a-collapse-panel>
    </a-collapse>
  </div>
  <div class="app-right">
    <div v-if="categoryFilter || seriesFilter || tagFilter" class="sticky-filters">
      <span v-if="categoryFilter" style="margin-right: 18px">
        分类：{{ categoryFilter }}
        <CloseSquareOutlined style="cursor: pointer" @click="changeCategoryFilter('')" />
      </span>
      <span v-if="seriesFilter" style="margin-right: 18px">
        系列：{{ seriesFilter }}
        <CloseSquareOutlined style="cursor: pointer" @click="changeSeriesFilter('')" />
      </span>
      <span v-if="tagFilter">
        标签：{{ tagFilter }}
        <CloseSquareOutlined style="cursor: pointer" @click="changeTagFilter('')" />
      </span>
    </div>
    <PostInfoItem
      v-for="post in filteredPosts"
      :key="post.id"
      :post="post"
      @click-category="changeCategoryFilter"
      @click-series="changeSeriesFilter"
      @click-tag="changeTagFilter"
    />
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
}
.app-right {
  margin-left: calc((100% - #{$app-right-width} + #{$app-left-width} + #{$app-gap-width}) / 2);
  width: $app-right-width;
  background: white;
  min-height: 100vh;
  .sticky-filters {
    position: sticky;
    top: 0px;
    font-size: 15px;
    padding: 16px 20px;
    background: #e9f0f3;
    color: rgb(33, 53, 68);
    border-bottom: 1px solid #beccd3;
  }
  :deep(.post-info-item) {
    margin: 0 24px;
    padding: 24px 0;
    border-bottom: 1px solid #ddd;
  }
}
</style>
