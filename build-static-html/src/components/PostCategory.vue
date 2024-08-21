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
  padding: 0 4px;
  color: #795548;
  background: #f7f0ee;
  outline: 1px solid #e1cec7;
  border-radius: 2px;
  cursor: pointer;
}
</style>
