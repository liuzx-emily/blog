<script setup>
import PostTag from "../../../components/PostTag.vue";
import { tagsList } from "../../../store";

const emit = defineEmits(["select"]);
</script>

<template>
  <div class="tags">
    <PostTag
      v-for="tag in tagsList"
      :key="tag.name"
      :tag="tag.name"
      @click="emit('select', tag.name)"
    >
      {{ tag.name }}
      <span class="tag-count" v-if="tag.count > 1"> ({{ tag.count }}) </span>
    </PostTag>
  </div>
</template>
<style lang="scss" scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  .post-tag {
    padding: 0 3px;
    color: #445a64;
    background: #f6f7f6;
    outline: 1px solid #dcdddd;
    font-size: 13px;
    .tag-count {
      color: #b77309;
    }
  }
}
</style>
