<script setup>
defineProps({
  series: {
    required: true,
    type: String,
  },
});
</script>

<template>
  <span class="post-series">{{ series }}</span>
</template>

<style lang="scss" scoped>
.post-series {
  padding: 0 4px;
  background: white;
  outline: 1px solid #d1d1d1;
  font-size: 13px;
  margin-right: 8px;
  border-radius: 2px;
  color: #555;
  cursor: pointer;
}
</style>
