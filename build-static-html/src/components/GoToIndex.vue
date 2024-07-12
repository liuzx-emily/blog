<script setup>
import { HomeOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goToIndex() {
  router.push("/");
}
</script>

<template>
  <a-button @click="goToIndex"><HomeOutlined />前往首页</a-button>
</template>
<style lang="scss" scoped>
.ant-btn {
  position: fixed;
  bottom: 100px;
  right: 60px;
}
</style>
