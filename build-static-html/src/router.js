import { createRouter, createWebHashHistory } from "vue-router";
import { isMobile } from "./store";
import MobilePostDetail from "./views/PostDetail/MobilePostDetail.vue";
import PostDetail from "./views/PostDetail/PostDetail.vue";
import MobilePostList from "./views/PostList/MobilePostList.vue";
import PostList from "./views/PostList/PostList.vue";

const routes = [
  { path: "/", name: "index", component: isMobile ? MobilePostList : PostList },
  { path: "/post/:id", component: isMobile ? MobilePostDetail : PostDetail },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
