<script setup>
import { CloseSquareOutlined, FilterOutlined } from "@ant-design/icons-vue";
import { ref, h } from "vue";
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

const drawerVisible = ref(false);
const drawerActivePanel = ref(["categories"]);
</script>

<template>
  <a-drawer
    v-model:open="drawerVisible"
    class="mobile-post-list-drawer"
    placement="left"
    width="320"
    :closable="false"
  >
    <a-collapse v-model:activeKey="drawerActivePanel">
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
  </a-drawer>
  <div class="mobile-post-list-container">
    <div class="sticky-filters">
      <a-button @click="drawerVisible = true" :icon="h(FilterOutlined)"></a-button>
      <div class="active-filters">
        <span v-if="categoryFilter">
          分类：{{ categoryFilter }}
          <CloseSquareOutlined @click="changeCategoryFilter('')" />
        </span>
        <span v-if="seriesFilter">
          系列：{{ seriesFilter }}
          <CloseSquareOutlined @click="changeSeriesFilter('')" />
        </span>
        <span v-if="tagFilter">
          标签：{{ tagFilter }}
          <CloseSquareOutlined @click="changeTagFilter('')" />
        </span>
      </div>
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
.mobile-post-list-container {
  background: white;
  min-height: 100vh;
  .sticky-filters {
    position: sticky;
    top: 0px;
    font-size: 14px;
    padding: 6px;
    background: #213544;
    color: white;
    display: flex;
    column-gap: 8px;
    align-items: center;
    .active-filters {
      display: flex;
      flex-wrap: wrap;
      column-gap: 18px;
      align-items: center;
    }
  }
  :deep(.post-info-item) {
    margin: 0 10px;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    .post-title {
      font-size: 15px;
    }
    .post-metadata-container {
      flex-wrap: wrap;
      column-gap: 8px;
      font-size: 12px;
      .post-date .anticon {
        display: none;
      }
    }
    .post-description {
      line-height: 1.3;
      font-size: 12px;
    }
  }
}
</style>
<style lang="scss">
.mobile-post-list-drawer {
  .ant-drawer-body {
    padding: 6px;
  }
}
</style>
