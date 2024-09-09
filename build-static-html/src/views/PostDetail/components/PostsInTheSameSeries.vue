<script setup>
defineProps({
  postsInTheSameSeries: {
    required: true,
    type: Array,
  },
});
</script>

<template>
  <div v-for="seriesPost in postsInTheSameSeries" :key="seriesPost.id" class="series-post">
    <router-link
      :to="'/post/' + seriesPost.id"
      target="_blank"
      :class="seriesPost.isCurrentPost ? 'current-post' : 'another-post'"
    >
      <span v-if="seriesPost.draft" style="color: #ef6c00">[草稿]</span>{{ seriesPost.briefTitle }}
    </router-link>
  </div>
</template>
<style lang="scss" scoped>
.series-post {
  font-size: 14px;
  line-height: 20px;
  margin: 8px 0;
  display: flex;
  .current-post {
    color: #333;
    pointer-events: none;
    &::before {
      content: "✦";
      color: orange;
      margin-right: 6px;
    }
  }
  .another-post {
    color: #333;
    &::before {
      content: "✧";
      color: #03a9f4;
      margin-right: 6px;
    }
  }
  .another-post:hover {
    transition: color 0s;
    color: #2196f3;
    text-decoration: underline;
  }
}
</style>
