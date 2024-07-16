---
id: 712988a6-8046-4a13-acfb-23b33ceca90c
title: 在 npm 上发布包 npm publish
createTime: 2024-06-12
updateTime:
categories: npm commands
tags: npm publish
description: 在 npm 上发布 package 的流程和注意事项
---

在 npm 上发布 package

## 注册

去 npm 官网注册账号

## 登录

在 cmd 中登录 `npm login`。登录失败，报 403。

google 后修改 npm registry：`npm config set registry http://registry.npmjs.org/`。再次登录仍然失败，报 426。

google 后说是 node 版本过老，但是我升到最新版也没用。折腾一番发现是 registry 不能用 `http`，要用 `https`。修改 `npm config set registry https://registry.npmjs.org/`。再次登录，成功。

## 发布

新建文件夹 lib-a，初始化 `npm init -y`

新建 index.js：

```js
const str = "hello";
module.exports = { str };
```

发布时 package 的名称是由 package.json 中的 `name` 字段规定的。加个前缀防止重名：

```js
  "name": "lilytest-lib-a",
```

发布 `npm publish`

## 小心！npm 不是原样上传！

发布时，npm 并不是把当前目录下所有内容原样上传。

在 npm 发布 package 时，可以使用 **packge.json 的 files 字段(白名单)** 和 **.npmignore 文件(黑名单)** 告诉 npm 你想包含哪些文件。但是你的决定权是**有限**的，有一部分内容是 npm 强制包含或排除的，无论你怎么设置都无法改变。

如果说上述行为算是可以理解的，那么下面的操作就让人难以接受了：在别人使用 npm install 安装你发布的包时，npm 会修改你包中的文件！——说的就是 `.gitignore` ，npm 会把它自动重命名为 `.npmignore`。
这对普通项目可能影响不大，但是对于 generator 就影响很大了（比如我的[脚手架](https://blog.csdn.net/tangran0526/article/details/139417312)）。而且这一自动重命名的行为是强制的，你无法通过任何设置取消。
generator 中 .gitignore 问题的解决方案：generator/template 中的 .gitignore 改名为 gitignore，在构建时自动改回来

详细内容看[另一篇文章](https://blog.csdn.net/tangran0526/article/details/139673961)
