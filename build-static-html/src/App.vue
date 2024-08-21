<script setup>
import { useRoute } from "vue-router";
import "./assets/css/common.scss";
import BackToTop from "./components/BackToTop.vue";

const route = useRoute();
</script>

<template>
  <RouterView :key="route.fullPath" />
  <BackToTop />
</template>

<style>
body {
  background: #213544 url(./assets/svg/bg.svg) fixed;
  margin: 0;
}
</style>
