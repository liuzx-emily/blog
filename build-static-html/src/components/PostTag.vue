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
  background: #f9f9f9;
  margin-right: 8px;
  border-radius: 2px;
  color: #29b6f6;
  outline: 1px solid #d4ebf5;
  cursor: pointer;
}
</style>
