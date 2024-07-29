import vue from "@vitejs/plugin-vue";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import { baseUrl } from "../config.js";

// https://vitejs.dev/config/
// https://cn.vitejs.dev/guide/static-deploy.html#github-pages

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  return {
    base: baseUrl + "/",
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
