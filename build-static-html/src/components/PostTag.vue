<script setup>
defineProps({
  tag: {
    required: true,
    type: String,
  },
});
</script>

<template>
  <span class="post-tag" @click="clickTag">
    <slot>{{ tag }} </slot>
  </span>
</template>

<style lang="scss" scoped>
.post-tag {
  font-size: 13px;
  padding: 0 4px;
  background: #e9f0f3;
  margin-right: 8px;
  border-radius: 2px;
  color: #1e4658;
  outline: 1px solid #c1d7e1;
  cursor: pointer;
}
</style>
