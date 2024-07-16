---
id: 2d32697a-e76c-4b96-a064-e96ae538af58
title: vscode 中 eslint 无效？npm init 是什么？
createTime: 2024-06-07
updateTime:
categories: 底层工具
tags: eslint, vscode, npm
description: 项目配置了 eslint，但是 vscode 并不能实时提示。研究后发现是 vscode 版本过旧，不能识别新版 eslint 的配置文件，升级 vscode 和其 eslint 插件即可解决。在此过程中，简单了解了 npm init 的用法。
---

## vscode 中 eslint 无效

我想要给一个项目添加 eslint，按照 eslint 官方指南操作：

```cmd
npm init @eslint/config@latest
```

![在这里插入图片描述](../post-assets/adcf40d0-986b-4311-929b-d6e31d2148eb.png)

自动安装了相关依赖并创建配置文件 `eslint.config.mjs`。

按理说，此刻项目应该已经配置好 eslint 了。但是我的编辑器 **vscode** 并不能检测到代码中的错误？？？！！！

![在这里插入图片描述](../post-assets/3e8be69c-c1a3-441c-98da-e9f283d93507.png)

---

## 破案了：eslint 无罪，是 vscode 版本过低

折腾了半天解决了，直接上结论：eslint 生效了。<span style="color:darkorange">但是编辑器中的错误提示是 vscode 的 eslint 插件提供的，这个插件没生效！</span>

![在这里插入图片描述](../post-assets/2309a14e-c880-495b-a819-333290aab7e8.png)

### 如何证明 eslint 生效了？

在控制台执行 `eslint index.js`，成功找到所有错误

### vscode 对 eslint 的支持没生效

`npm init @eslint/config@latest` 是按照**最新**的 eslint 规则进行安装和配置的。eslint 的最新版本是 v9+，和之前的版本相比有很多 **breaking changes**。而我此时用的 vscode 已经两年没有更新了。。。所以 vscode 无法识别最新的 eslint 规则。

eslint v9+的 breaking changes 很多，不一一列举了，这里只说一个：配置文件格式变动，以前的 `.eslintrc.js.`等已全面弃用

![在这里插入图片描述](../post-assets/bf20d032-666b-4e12-9383-05cf2b7599c2.png)

我也是在研究途中才发现我的 vscode 已经两年没更新了。虽然我给 vscode 设置了自动更新，但是貌似因为我给 vscode 设置了“以管理员身份运行”，自动更新从来没生效。。。

![在这里插入图片描述](../post-assets/ea1be895-0835-46ab-bd4f-49a7a790ab19.png)

我一开始还升级过 vscode eslint 插件的版本，没用。原来病根在 vscode 身上。

把 vscode 和 vscode eslint 插件的版本都升到最新后，一切都 OK 了！

---

## 一些心路历程

在研究的过程中（此时还是老版本的 vscode），我发现把配置文件换成以前的格式 `.eslintrc.js` 后，vscode 就能正确识别 eslint 了。
我在 eslint 官网查到 eslint 的新老版本配置文件变化很大，所以想到是版本不匹配的问题了。

我立刻升级了 vscode eslint 插件，但还是不起作用。这时候的我完全没想到是 vscode 版本过老，还以为是这个插件没有 up to speed

所以当时的我认为，只能在项目里用一个老点的 eslint 版本，让 vscode 能认识。

我看到 `npm init @eslint/config@latest` ，自作聪明的尝试 `npm init @eslint/config@8`（试图安装 eslint 8）。失败：

![在这里插入图片描述](../post-assets/092df5d1-ee95-41e9-98c4-67ae86654e79.png)

果然没那么简单，哈哈哈。所以我去研究了一下 [npm init](https://docs.npmjs.com/cli/v10/commands/npm-init) 的用法

---

## npm init

![在这里插入图片描述](../post-assets/25e8e633-4740-413f-a620-080afa3d1a67.png)

我应该查看 `@eslint/create-config` 包的版本（在上一部分安装@8 的报错信息也提到了这个包），看看它有没有哪个版本是对应 eslint 8 的。
——经过我一番查找，没有！这条路又堵死了，看来不能用自动化工具了。~~只能自己乖乖安包，自己写配置文件了~~（并不，升级 vscode 版本就好了）

![在这里插入图片描述](../post-assets/1488fd81-e3d9-4cc2-a46c-d28212642597.png)
