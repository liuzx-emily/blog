<script setup>
defineProps({
  toc: {
    required: true,
    type: Array,
  },
});
const emit = defineEmits(["click"]);
</script>

<template>
  <div class="post-toc-container">
    <div
      class="post-toc"
      v-for="(o, index) in toc"
      :key="index"
      :data-level="o.level"
      :title="o.text"
      @click="emit('click', index)"
    >
      {{ o.text }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.post-toc-container {
  .post-toc {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    color: #333;
    &:hover {
      background-color: #eff4f5;
    }
  }
  .post-toc[data-level="2"] {
    padding-left: 10px;
    font-size: 14px;
    line-height: 34px;
  }
  .post-toc[data-level="3"] {
    padding-left: 30px;
    font-size: 14px;
    line-height: 34px;
  }
  .post-toc[data-level="4"] {
    padding-left: 54px;
    font-size: 13px;
    line-height: 32px;
  }
}
</style>
