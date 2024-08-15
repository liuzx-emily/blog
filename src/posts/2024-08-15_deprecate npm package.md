---
id: a0998f6a-7915-4b22-97be-3e7c4f8c2dfc
title: deprecate npm package
createTime: 2024-08-15
updateTime:
categories: npm commands
tags: npm deprecate
series: npm 学习
description: 不想再维护某个包，或者想彻底删除但不符合条件时，可以弃用（deprecate）包；也可以仅弃用某个版本。用户安装被弃用的内容时可以看到警告信息。弃用操作可以随时取消，取消仍然使用 deprecate 命令，只需把 message 替换为空字符串。
---

可以 deprecate 整个包，或者仅仅 deprecate 某个版本。当用户安装 deprecated 的内容时，会在控制台看到警告信息。

在 npm 网站上 搜不到 deprecated 的包，在 deprecated 包的主页也会看到警告信息。

## 什么情况下想要 deprecate

- 不再维护某个包
- 想鼓励用户更新到新的或不同的版本
- 想彻底删除某个包，但是不符合删除条件，只能退而求其次选择 deprecate

## deprecate

在 npm 网站可以 deprecate 整个包：登录后打开包的主页，在 settings 面板中操作。

使用 deprecate 命令可以弃用整个包或某个版本：message 不能为空，因为空代表取消弃用！

```bash
npm deprecate <package-name> "<message>"
npm deprecate <package-name>@<version> "<message>"
```

## undeprecate

unpublish 操作不可撤销，执行前一定要谨慎确认。但是 deprecate 可以随时取消。

取消弃用仍然使用 deprecate 命令，只要把 message 置为空字符串就代表是要取消（好怪），空字符串两侧必须用英文双引号。

```bash
# undeprecate 整个包
npm deprecate <package-name> ""
# undeprecate 某个版本
npm deprecate <package-name>@<version> ""
```

## 将弃用的包转移到 npm 官方账号

如果你想删除某个包，但是不满足删除条件。你可以把包转移到 npm 账号下，这样你在自己的账号下就看不到了（眼不见心不烦，yeah）

```bash
npm owner add npm <package-name>
npm owner rm <user> <package-name>
```

为了不给 npm 账号下添加垃圾 package，我就不测试效果了

---

参考：

- [Deprecating and undeprecating packages or package versions](https://docs.npmjs.com/deprecating-and-undeprecating-packages-or-package-versions)
- [npm deprecate](https://docs.npmjs.com/cli/v10/commands/npm-deprecate)
