<script setup>
defineProps({
  tag: {
    required: true,
    type: String,
  },
});
</script>

<template>
  <span class="post-tag">
    <slot>{{ tag }}</slot>
  </span>
</template>

<style lang="scss" scoped>
.post-tag {
  padding: 0 4px;
  color: #1e4658;
  background: #e9f0f3;
  outline: 1px solid #c1d7e1;
  border-radius: 2px;
  cursor: pointer;
}
</style>
