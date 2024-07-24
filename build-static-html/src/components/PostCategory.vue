<script setup>
defineProps({
  category: {
    required: true,
    type: String,
  },
});
</script>

<template>
  <span class="post-category">{{ category }}</span>
</template>
<style lang="scss" scoped>
.post-category {
  outline: 1px solid #e1cec7;
  margin-right: 8px;
  padding: 0 4px;
  border-radius: 2px;
  color: #795548;
  cursor: pointer;
  background: #f7f0ee;
}
</style>
