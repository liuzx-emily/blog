<script setup>
import { ApartmentOutlined, HomeOutlined } from "@ant-design/icons-vue";
import { h, ref } from "vue";
import PostInfoItem from "../../components/PostInfoItem.vue";
import PostContent from "./components/PostContent.vue";
import PostsInTheSameSeries from "./components/PostsInTheSameSeries.vue";
import PostToc from "./components/PostToc.vue";
import { usePostDetail } from "./usePostDetail";

const { post, toc, postsInTheSameSeries, clickCategory, clickTag, clickSeries, clickToc } =
  usePostDetail();

const drawerVisible = ref(false);
const activeDrawerPanel = ref(["series", "toc"]);
</script>

<template>
  <a-drawer
    v-model:open="drawerVisible"
    class="mobile-post-list-drawer"
    placement="left"
    width="320"
    :closable="false"
  >
    <a-collapse v-model:activeKey="activeDrawerPanel" expand-icon-position="end">
      <a-collapse-panel key="series" :header="'系列：' + post.series" v-if="post.series">
        <PostsInTheSameSeries :posts-in-the-same-series="postsInTheSameSeries" />
      </a-collapse-panel>
      <a-collapse-panel key="toc" header="目录" v-if="toc.length > 0">
        <PostToc :toc="toc" @click="clickToc" />
      </a-collapse-panel>
    </a-collapse>
  </a-drawer>
  <div class="sticky-header">
    <router-link to="/" class="back-to-homepage"> <HomeOutlined />返回主页 </router-link>
    <a-button @click="drawerVisible = true" :icon="h(ApartmentOutlined)">
      查看同系列文章、本文目录
    </a-button>
  </div>
  <div class="post-detail-container">
    <PostInfoItem
      :post="post"
      @click-category="clickCategory"
      @click-series="clickSeries"
      @click-tag="clickTag"
    />
    <PostContent :content="post.content" />
  </div>
</template>

<style scoped lang="scss">
.sticky-header {
  position: sticky;
  top: 0px;
  font-size: 14px;
  padding: 6px;
  background: #213544;
  color: white;
  display: flex;
  column-gap: 8px;
  align-items: center;
  .back-to-homepage {
    color: white;
    display: flex;
    column-gap: 4px;
    align-items: center;
    margin-right: 10px;
  }
}
.post-detail-container {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 8px;
  background: white;

  :deep(.post-info-item) {
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
    .post-title {
      font-size: 20px;
      a {
        pointer-events: none;
      }
    }
    .post-metadata-container {
      flex-wrap: wrap;
    }
    .post-description {
      line-height: 1.3;
    }
  }
  :deep(#post-content) {
    font-size: 13px;
    h2 {
      font-size: 16px;
      padding: 8px 0 8px 8px;
    }
    h3 {
      font-size: 15px;
      padding: 5px 0 5px 8px;
    }
    h4 {
      font-size: 14px;
      margin: 10px 0;
    }
    h5 {
      font-size: 13px;
      margin: 8px 0;
    }
    h6 {
      font-size: 13px;
    }
    li,
    p {
      line-height: 20px;
    }

    hr {
      margin: 25px 0;
    }

    pre {
      padding: 4px;
    }
    code {
      font-size: 12px;
    }
  }
}
</style>
