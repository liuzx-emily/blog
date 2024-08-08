<script setup>
import { VerticalAlignTopOutlined } from "@ant-design/icons-vue";

function backToTop() {
  document.querySelector("body").scrollIntoView({ behavior: "smooth", block: "start" });
}
</script>

<template>
  <span class="back-to-top-button" @click="backToTop"><VerticalAlignTopOutlined /></span>
</template>
<style lang="scss" scoped>
.back-to-top-button {
  position: fixed;
  bottom: 100px;
  right: 100px;
  box-sizing: border-box;
  width: 40px;
  height: 39px;
  padding-top: 10px;
  border-radius: 50%;
  background-color: white;
  text-align: center;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #eff4f5;
  }
}
</style>
