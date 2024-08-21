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
  color: #555;
  background: white;
  outline: 1px solid #d1d1d1;
  border-radius: 2px;
  cursor: pointer;
}
</style>
