<script setup>
import { CalendarOutlined } from "@ant-design/icons-vue";
defineProps({
  val: {
    required: true,
    type: String,
  },
});
</script>

<template>
  <div class="post-date">
    <CalendarOutlined />
    {{ val }}
  </div>
</template>
<style lang="scss" scoped>
.anticon {
  color: #777;
}
</style>
