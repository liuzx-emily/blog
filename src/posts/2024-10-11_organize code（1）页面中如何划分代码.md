---
id: f351e19e-b84b-4da0-bf3d-052f26a1626a
title: organize code（1）页面中如何划分代码
createTime: 2024-10-11
updateTime:
categories: vue
tags: 方法论
series: organize code
description:
---

本文并非记录前端技术演化过程，所以有些内容不会在正文中说明，比如：**传统开发** 和 **组件化** 都可以在静态项目（即无需构建的项目）中使用，但是 **单文件组件** 必须在使用构建工具的项目中才能使用，但正文中不会介绍 **无构建** -> **构建** 这一演化过程。

## 传统开发 - 按类型划分代码（html、css、js）

传统开发方式中，代码是根据"类型"去划分的，分为三类：html、css、js。典型的项目结构如下：

<pre>
- js
    - header.js
    - main.js
- css
    - header.css
    - main.css
- index.html
</pre>

页面中某一块部分的代码分散在这三层中。比如 header 部分，逻辑写在 js/header.js，样式写在 css/header.css，视图在 index.html 中的一部分。

而且虽然 css 和 js 按照功能拆分成多个文件，但是内容都还是在全局作用域下。无论是给 js 变量起名字还是给 el 起 class 都要小心重名。不止要考虑自己写的代码，还要操心第三方插件（比如以前很多插件都在用 `$`）。

## 模块化/组件化 - 按功能划分代码（Header、Main、Footer）

随着页面功能变复杂，传统开发方式难以应对。前端也有了模块化、组件化等概念，这些新概念有一个共同理念，即按“功能”划分代码。典型的项目结构如下：

<pre>
- Header
    - Header.css
    - Header.template
    - Header.js
- Main
    - Main.css
    - Main.template
    - Main.js
</pre>

页面按功能划分成几块。每块的视图、样式、逻辑的代码都放在一起。

下面以 vue 语法为例，介绍具体用法。

### vue 组件 - 耦合 html + js

vue 提供 **组件**功能，让你能够按功能划分代码。

```js
const MyMessage = {
  template: `<p class="message-container">{{ message }}</p>`,
  data() {
    return {
      message: "Hello",
    };
  },
  created() {
    console.log("message component created");
  },
};
```

使用 vue 组件将 html、js 部分耦合在一起。而且 js 部分有了“组件”这一层作用域，起名要容易很多。但是 vue 组件并不包含 css 部分，样式还是在全局作用域下，所以组件内 dom 元素的 class 名称还是要小心重名。

### SFC - 耦合 html + js + css

vue 提供 [SFC](https://v2.cn.vuejs.org/v2/guide/single-file-components.html)（Single File Component 单文件组件），它的 scoped css 功能允许你在写组件的同时定义样式，而且这个样式仅在当前组件生效。

```html
<style lang="scss" scoped>
  .container {
    color: red;
  }
</style>
<script>
  export default {
    data() {
      return {
        message: "Hello",
      };
    },
  };
</script>
<template>
  <p class="container">{{ message }}</p>
</template>
```

当然，SFC 还有很多优势，它是 vue 组件的全面加强版：

- scoped css
- 在 `<template>` 标签中写字符串模板，像写 html 一样丝滑，有语法高亮、智能补全、格式化、校验等
- 可以很方便地使用 babel、scss 等预处理器

SFC 需要编译后才能使用。vue 给主流的构建工具（如 webpack、vue-cli、vite）都编写了插件解析 SFC，给主流的 IDE（如 vscode、webstorm）编写了插件以支持 SFC 语法高亮、智能提示。

> 在一个组件中，其模板、逻辑和样式本就是有内在联系的、是耦合的，将它们放在一起，实际上使组件更有内聚性和可维护性。—— 引用 [vue doc](https://cn.vuejs.org/guide/scaling-up/sfc.html#what-about-separation-of-concerns)

## 总结

本文讨论了一个页面中如何划分代码，从 **传统开发 - 按类型划分代码（html、css、js）** 到 **模块化/组件化 - 按功能划分代码（Header、Main、Footer）**。

现在，项目已经划分为一个一个组件了。接下来要讨论的是：在一个组件内部如何划分代码？
