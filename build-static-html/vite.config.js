import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
// https://vitejs.dev/config/
// https://cn.vitejs.dev/guide/static-deploy.html#github-pages

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  return {
    base: "/liuzx-emily/",
    build: {
      outDir: "../dist/",
    },
    plugins: [
      vue(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // css in js
          }),
        ],
      }),
    ],
  };
});
