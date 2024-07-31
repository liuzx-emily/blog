---
id: 13a42262-1d59-4190-8d6c-7c2d496ae76e
title: vite 处理资源：静态资源、引用时设置后缀指定方式、public
createTime: 2024-07-31
updateTime:
categories: build tools
tags: vite
description:
---

<p style="background:#FFECB3;padding:5px 10px;">下述所有内容的大前提都是使用 vite <strong>构建页面应用</strong>。不适用于 vite 打包 library 的情况。</p>

本文介绍 vite 处理资源的几种情况：

- vite 项目中有一类资源称为 **静态资源**，包括图片、视频、字体、pdf、txt 等。vite 对待这类资源比较特殊：

  - 它们不会经过 plugin transform pipeline 的处理
  - 在 js 中引用时不返回文件内容，只返回 url

- vite 项目中引用资源（所有资源，无论是不是静态资源）时，可以通过设置后缀指定引用方式。常用的有：

  - `?url` 指定获取资源的 url
  - `?raw` 指定将资源内容作为字符串导入 等等）

- vite 项目中有一个特殊的 public 文件夹，它里面的所有内容在打包时会被原样、完整的保存下来

文末会简单提一下 vite 打包 library 的情况。

相关阅读：[《vite 项目引用图片（动态地址）》](post:25e9063b-f197-4430-a355-80fc7734eafa)

## 静态资源

vite 的静态资源有哪些类型？

- vite 内置的静态资源类型 [KNOWN_ASSET_TYPES](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts) 包括图片、视频、字体、pdf、txt 等
- 通过设置 [assetsInclude](https://cn.vitejs.dev/config/shared-options.html#assetsinclude) 来指定额外的静态资源类型。

vite 对待静态资源有何特殊之处？

- 引用时不会通过 plugin transform pipeline 处理
- 在 js 中引用时会返回 url，而不是文件实体

  ```js
  import imgUrl from "./img.png"; // dev 时值为 /img.png; prod 时值为 /assets/img[hash].png
  ```

## 引用资源时设置后缀指定引用方式

在 vite 项目中引用资源时，可以通过设置后缀指定引用方式。这是 vite 提供的语法糖。

- `?url` 指定获取资源的 url
- `?raw` 指定将资源内容作为字符串导入
- `?worker` 指定将资源作为 web-worker 导入
- `?inline` 专门给 css 文件使用，样式不会注入到页面中，将内容作为字符串导入（经我测试对于 css 文件 `?inline` 的效果和 `?raw` 完全相同，怀疑是代码改了但是文档没有更新）

###### 举例：获取 css 文件内容

```css
/* bar.css */
body {
  background: red;
}
```

普通的引用 css 文件的方式会将样式自动注入页面：

```js
// main.js
import "./bar.css";
```

页面变红。

dev 时这段 css 代码插入到页面中的 style 标签里。build 时这段 css 代码放到 `assets/index[hash].css` 中，index.html 中引用这个 css 文件

如果想获取 css 文件的内容，但是并不想在页面中直接应用它，可以用 `?raw` 或 `?inline`。

```js
// main.js
import str from "./bar.css?raw";
// import str from "./bar.css?inline";  // 对于 css 文件，?inline 和 ?raw 效果完全相同
alert(str);
```

此时页面不会变红，弹出 css 内容字符串。这段 css 代码不会被应用：在 dev 时不会放到 style 标签里；prod 时不会放在 assets/index[hash].css 文件中。

## public

什么资源适合放在 public 目录下？

- 不需要在源码中使用的。比如 robots.txt（位于网站根目录下，告诉搜索引擎抓取工具你希望它访问哪些内容）
- 要求文件名称保持不变(不加 hash)

public 的资源在开发时能直接通过 `/` 根路径访问到

打包时 public 下的所有内容会被完整、原样复制到 dist 根目录下。

- 完整：无论在源码中是否引用，打包时都会放进来
- 原样：不会给文件名称加 hash

vite 的文档中说 js 不能引用 public 下的文件。但是经我测试可以引用，所以我推测文档的含义是 **不推荐**。

---

## library mode

在文章开篇强调了本文所有讨论的大前提是使用 vite **构建页面应用**。

这里简单说一下用 vite 打包 library 的情况。

- public 中的内容会被完整、原样放到 dist 根目录下（很怪）
- 在 js 中引用静态资源时，打包后资源会转为内联 base64

###### 引用静态资源

```js
import picUrl from "./dir1/pic1.png";
console.log(picUrl);
```

- vite 构建**页面应用** 时，js 引用静态资源返回 url。打包结果：

```js
// dist/assets/index[hash].js
const picUrl = "/assets/pic1-CyQs3NHV.png";
console.log(picUrl);
```

- vite 构建 **library** 时，js 引用静态资源转换为内联 base64

在 vite.config.js 中设置：

```js
build: {
  lib: {
    entry: resolve(__dirname, "main.js"),
    name: "MyLib",
    fileName: "my-lib",
  },
};
```

打包结果：

```js
// dist/my-lib.js
const picUrl = "[图片的 base64 格式，非常长，略]";
console.log(picUrl);
```

### 个人观点：不建议用 vite 打包 library

vite 功能设计、文档介绍均以构建页面应用为主。

文档中关于 library 的部分非常短，其他有几个零散说明散落在文档各处，有缘者才能看到（你用官网的搜索或者看教程标题找是找不到的）。

vite 在构建应用和 library 时会有一些细节的不同，但是在文档中并不会说明 —— 不止不说明区别是什么，连有区别都不说，给你一个 big surprise！

而且一些 build library 时常用的功能 vite 并未实现。

—— 没有 diss 的意思，毕竟 vite 的重心不在此。
