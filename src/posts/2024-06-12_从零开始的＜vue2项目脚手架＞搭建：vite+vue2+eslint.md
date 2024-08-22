---
id: 1ac6fb5e-1737-44a7-881e-31a35ba69e33
title: 从零开始的＜vue2项目脚手架＞搭建：vite+vue2+eslint
createTime: 2024-06-12
updateTime:
categories: vue, npm commands, nodejs
tags: npm init, npm publish
description: 自己搭建一个项目初始化的脚手架。只需要执行 npm init lily-cli 就可以自动创建 vite+vue2+eslint 项目。
---

[源码](https://github.com/liuzx-emily/create-lily-cli)

## 前言

为了写 demo 或者研究某些问题，我经常需要新建空项目。每次搭建项目都要从头配置，很麻烦。所以我决定自己搭建一个项目初始化的脚手架（取名为 **lily-cli**）。

> 脚手架（scaffolding）：创建项目时，自动完成的创建初始文件等初始化工作。这些工作往往是每次新建工程都要进行的重复性工作。

目标：我只需要执行 `npm init lily-cli`，就会自动创建一个符合我要求（vite+vue2+eslint）的空项目。

碎碎念：
现在 vue3 是主主主主流。我作为一个不得不使用 vue2 的开发者，在 vue3 浪潮下想要搜索 vue2 的内容真的有一点点麻烦——比如说，vite 已经不提供 vue2 的官方初始化模板了，而 vite 的社区模板也没有适合我的，所以我还是自己搭建一个吧。

分成两步实现：

1. 手动创建一个 vite+vue2+eslint 的项目
2. 以上一步的项目作为模板，写一个脚本自动创建新项目

## Step 1：手动创建项目 vite+vue2+eslint

### 初始化

新建文件夹 template_vite_vue2_eslint

`npm init -y`

### vite + vue2

在 vite 中使用 vue2.7+，要用 `@vitejs/plugin-vue2`。这个插件已经不再更新了，安装时可以直接锁定最新版本 2.3.1。

vite 和 vue 的版本要看 @vitejs/plugin-vue2 的要求：

```json
// @vitejs/plugin-vue2 最新版本的 package.json
  "peerDependencies": {
    "vite": "^3.0.0 || ^4.0.0 || ^5.0.0",
    "vue": "^2.7.0-0"
  },
```

`pnpm i vite@"^5.0.0" vue@"^2.7.0" @vitejs/plugin-vue2@2.3.1`

在 package.json 中添加 scripts：

```js
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
```

新建 `vite.config.js`：

```js
import vue from "@vitejs/plugin-vue2";

export default {
  plugins: [vue()],
};
```

### 创建 main.js 等文件

```js
// src/main.js
import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;
Vue.config.devtools = true;

new Vue({
  el: "#app",
  render: (h) => h(App),
});
```

```html
// src/App.vue
<template>
  <section>{{ message }}</section>
</template>

<script setup>
  import { ref } from "vue";
  const message = ref("模板");
</script>
```

```html
// index.html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

### eslint

配置 eslint `npm init @eslint/config@latest`

如有问题可参考 [《vscode 中 eslint 无效》](post:2d32697a-e76c-4b96-a064-e96ae538af58)

## Step 2：搭建脚手架，让一切自动化

### npm init、bin

在前言中说了，我的目标是：**执行 `npm init lily-cli` 就会自动创建项目**。

需要先了解一下 `npm init` 这个命令，看[这篇文章](post:6ebbba5f-9e24-4ead-a848-fe18bf8420c5)。我的脚手架名称是 lily-cli，所以包的名称是 `create-lily-cli`，并且 package.json 中要设置 bin 字段（注意 bin 的入口文件必须以 `#!/usr/bin/env node` 开头）。

### 初始化项目

- 新建文件夹 _create-lily-cli_
- `git init`，新建 .gitignore
- `npm init -y`
- 在 package.json 中设置 `"type": "module"` (个人习惯使用 import/export 语法）
- 新建 index.js
- 在 package.json 中设置 `"bin": "./index,js"`

为了防止歧义，明确一下称呼：

- Step 1 中创建的 template_vite_vue2_eslint 为 "模板项目"。它是为了给 "脚手架项目" 提供参考的模板
- Step 2 中创建的 create-lily-cli 为 "脚手架项目"。它的作用是一键生成 "成果项目"
- 使用 create-lily-cli 脚手架自动生成的，称为 "成果项目"，它应该和 "模板项目" 长得一致

### 目标功能

1. 自动生成项目所有文件
2. 自动安装依赖
3. 自动初始化 git 并 commit

### 开发功能

实现思路：
在脚手架项目中新建文件夹 template，把 "模板项目" 的文件都复制到这个文件夹下（ **.git** 文件夹、**node_modules** 文件夹和 **pnpm-lock.yaml** 除外）。
编写脚本，使每次执行脚本时复制 /template 下的所有内容到目标路径，这就实现了 _功能 1：自动生成项目所有文件_。
功能 2 和 3 更简单，让脚本自动执行命令。

需要注意的是，在功能 3 的 commit 之前，"成果项目" 中必须存在 .gitignore（不然成果项目/node_modules 也会被 commit）。
但是在使用你发布的包时，npm 不会保留你包里的 .gitignore 文件（具体解释见[另一篇文章](post:271015ca-d7a2-4a0d-a351-fbc598acfdbe)）。有两种解决方案：

1. 给 `template/.gitignore` 文件改名（比如改成 `template/gitignore`，去掉最前面的`.`)，这时就可以成功 publish 到 npm 仓库了。在脚本中写代码，对成果项目进行 git 操作前，先把 gitignore 文件的名字改回来
2. 干脆把 `template/.gitignore` 文件去掉。在脚本中给成果项目创建 `.gitignore` 文件

[具体代码看这里](https://github.com/liuzx-emily/create-lily-cli/blob/master/index.js)

插播：**别用 npm link！别用 npm link！别用 npm link**
在开发阶段我用 `npm link` + `npx create-lily-cli` 进行本地调试。调试完成准备发布，我需要解除本地 link。
我尝试了多种方法： `unlink`、`uninstall -g`、清除 npm cache、清除 npx cache，但都清理不掉 npx 中的缓存！（npm 的 link 应该是清理干净了，`npm i create-lily-cli` 已经不生效了）。
在我 publish 了之后再执行 npx，它还是用的之前本地 link 的版本。我最后是卸载 nodejs 重装才清理掉。。。。

### 发布到 npm

[npm publish](post:712988a6-8046-4a13-acfb-23b33ceca90c)

### 执行命令

执行 `npm init lily-cli`，成功！

---

写这个脚手架是受 [@eslint/config](https://github.com/eslint/create-config) 的启发 ![在这里插入图片描述](../post-assets/20c0c884-21a0-48b9-bcf4-ffe8af340069.png)
之前以为写这类东西很复杂，但是在研究 @eslint/config 源码的时候，发现还蛮简单的，所以才决定自己试试。
