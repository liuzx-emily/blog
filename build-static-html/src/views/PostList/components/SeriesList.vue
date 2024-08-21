<script setup>
import { seriesList } from "../../../store";

const emit = defineEmits(["select"]);
</script>

<template>
  <div>
    <div v-for="series in seriesList" :key="series" class="series">
      <span class="series-name" @click="emit('select', series.name)">{{ series.name }}</span>
      <span class="series-count"> ({{ series.posts.length }}) </span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.series {
  line-height: 26px;
  .series-name {
    color: #333;
    cursor: pointer;
  }
  .series-count {
    color: #b77309;
  }
}
</style>
