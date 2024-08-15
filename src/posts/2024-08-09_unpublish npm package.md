---
id: 2b9da1e4-0c77-499e-9aaf-5abaaecd436d
title: unpublish npm package
createTime: 2024-08-09
updateTime:
categories: npm commands
tags: npm unpublish
series: npm 学习
description: 删除 npm 包必须要满足特定条件（比如说如果有其它包依赖了你的包，那就不允许删除了）。可以删除整个包，也可以只删除某个版本。
---

之前研究 npm publish 和 npx 时发布了一个测试包。因为问题比较复杂所以进行了大量测试，不断修改-发布-安装，所以测试包的下载量很高。在我研究告一段落打算删除测试包时，惊恐地发现因为下载量高已经不能删除了。这个名字奇奇怪怪的测试包要永远留在我的 npm 账号下了（强迫症很悲伤）。

写这篇文章的时候，惊喜地发现这个测试包现在可以取消发布了。仔细看文档发现原来不是要求总下载量，而是上一周的下载量。这样就宽松多了，以后可以放心的测试包了。即使想取消的当下不满足条件，只要等一周下载量降下来了就可以了。yeah~

## 什么情况下想要 unpublish

- Published something accidentally.
- Wanted to test npm.
- Published content you didn't intend to be public.
- Want to rename a package. (The only way to rename a package is to re-publish it under a new name)

## unpublish 的条件

- 发布未超过 72 小时：只要没有其它包依赖你的包，就可以删除

- 发布后超过 72 小时，必须**同时**满足以下条件才可以删除
  - 没有其它包依赖你的包
  - **上周**下载量<300
  - 只有一个 owner/maintainer

如果不满足删除的条件，可以考虑 [deprecate](post:a0998f6a-7915-4b22-97be-3e7c4f8c2dfc)。

## 删除整个包

可以在 npm 网站操作：登录后打开包的主页，在 settings 面板中删除。也可以用 publish 命令：

```bash
npm unpublish <package-name> -f
```

执行命令时不需要在 package 项目目录下，只要命令行中登录了 npm 账号就可以执行（make sense，因为不需要 push 代码）。

删除包之后，24 小时之内不能发布同名包。

## 只删除某个版本

unpublish 命令也可以指定删除某个版本：

```bash
npm unpublish <package-name>@<version>
```

此操作会从 registry 中删除此版本（记为 v1），别人安装包的时候不能安装 v1 版本。也看不到 v1 版本（或者说根本不知道存在过 v1 版本）：无论是在 npm 网站查看，还是执行 `npm view <package-name> versions`，都没有 v1。

但是要注意：v1 这个版本号并不能再次使用！之后 publish 如果版本号是 v1 会失败报错：

```bash
400 Bad Request - Cannot publish over previously published version
```

---

参考资料：

- [npm unpublish policy](https://docs.npmjs.com/policies/unpublish)
- [Unpublishing packages from the registry](https://docs.npmjs.com/unpublishing-packages-from-the-registry)
- [npm - publish](https://docs.npmjs.com/cli/v10/commands/npm-unpublish)
