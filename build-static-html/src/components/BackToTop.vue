<script setup>
import { UpSquareOutlined } from "@ant-design/icons-vue";

function backToTop() {
  document.querySelector("#app .wrapper").scrollIntoView({ behavior: "smooth", block: "start" });
}
</script>

<template>
  <a-button @click="backToTop"><UpSquareOutlined />返回顶部</a-button>
</template>
<style lang="scss" scoped>
.ant-btn {
  position: fixed;
  bottom: 50px;
  right: 60px;
}
</style>
