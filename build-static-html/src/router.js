import { createWebHashHistory, createRouter } from "vue-router";

import PostList from "./views/PostList.vue";
import PostDetail from "./views/PostDetail.vue";

const routes = [
  { path: "/", name: "index", component: PostList },
  { path: "/post/:id", component: PostDetail },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
