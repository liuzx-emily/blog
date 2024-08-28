<script setup>
import { ref } from "vue";
import PostInfoItem from "../../components/PostInfoItem.vue";
import PostContent from "./components/PostContent.vue";
import PostsInTheSameSeries from "./components/PostsInTheSameSeries.vue";
import PostToc from "./components/PostToc.vue";
import { usePostDetail } from "./usePostDetail";

const { post, toc, postsInTheSameSeries, clickCategory, clickTag, clickSeries, clickToc } =
  usePostDetail();

const activeLeftPanel = ref(["series", "toc"]);
</script>

<template>
  <div class="post-detail-side-column pretty-scroll" v-if="post.series || toc.length > 0">
    <a-collapse v-model:activeKey="activeLeftPanel" expand-icon-position="end">
      <a-collapse-panel key="series" :header="'系列：' + post.series" v-if="post.series">
        <PostsInTheSameSeries :postsInTheSameSeries="postsInTheSameSeries" />
      </a-collapse-panel>
      <a-collapse-panel key="toc" header="目录" v-if="toc.length > 0">
        <PostToc :toc="toc" @click="clickToc" />
      </a-collapse-panel>
    </a-collapse>
  </div>
  <div class="post-detail-container">
    <router-link to="/" class="back-to-homepage">返回主页</router-link>
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
  :deep(.post-info-item) {
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
    .post-title {
      font-size: 26px;
      a {
        pointer-events: none;
      }
    }
  }
}
</style>
