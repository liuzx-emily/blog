<script setup>
import { provide } from "vue";
import { useRoute } from "vue-router";
import "./assets/css/common.scss";
import BackToTop from "./components/BackToTop.vue";
import GoToIndex from "./components/GoToIndex.vue";
import { posts } from "../data/posts.js";

const route = useRoute();
provide("posts", posts);
</script>

<template>
  <RouterView :key="route.fullPath" />
  <GoToIndex v-if="route.name !== 'index'" />
  <BackToTop />
</template>

<style>
body {
  background: #213544 url(./assets/svg/bg.svg);
  height: 100vh;
  margin: 0;
}
#app {
  height: 100%;
  overflow: auto;
}
</style>
