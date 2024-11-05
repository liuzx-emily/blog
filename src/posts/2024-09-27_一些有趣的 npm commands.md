---
id: 0aa8f020-7270-445b-833e-2a8a29a45742
title: 一些有趣的 npm commands
createTime: 2024-09-27
updateTime:
categories: npm commands
tags:
series: npm 学习
description: npm prefix, npm ci, npm pack, npm doctor, npm explain, npm ls, npm pkg, npm outdated, npm update, npm prune, npm workspace, npm shrinkwrap
---

## npm prefix

[npm prefix](https://docs.npmjs.com/cli/v10/commands/npm-prefix)：显示 prefix

`npm prefix`：显示 local prefix，即当前项目的根目录（指包含 package.json 或 node_modules 的最近的父级目录）

`npm prefix -g`：显示 global prefix，即 node 的安装目录

###### npm install 的文件存在哪？bin 链接到哪？

[npm doc - folders](https://docs.npmjs.com/cli/v10/configuring-npm/folders)

npm install 时，package 存在 `{prefix}/node_modules` 中。

- local 模式: `npm install foo`，当你想在项目中使用 foo 时选择此模式。

  此时 prefix 是 local prefix，安装的包会放在 `项目根目录/node_modules` 中。package 的可执行文件（bin）会被链接到 `./node_modules/.bin` 中 so that they can be made available to scripts run through npm.

  所以项目内安装包时，不要求在项目根目录执行 install 命令，在更里层执行也可以。

- global 模式: `npm install foo -g`，当你想在命令行中运行 foo（的 bin）时选择此模式。

  此时 prefix 是 global prefix，安装的包会放在 `node安装目录/node_modules` 中。package 的可执行文件（bin）会被链接到 `node安装目录` 中（windows 是放在这里，其他操作系统有细微不同），以确保 it's in your terminal's PATH environment to run them.

## npm ci

ci 即 clean install。

[npm ci](https://docs.npmjs.com/cli/v10/commands/npm-ci/) 用来在 CI/CD 环境（比如 github workflow）中安装依赖，安装的版本严格遵循项目的 lock 文件。

`npm ci` 和 `npm install` 的区别为：

- 如果项目中没有 lock 文件：
  - install 可以正常执行并会生成 lock 文件
  - ci 失败并报错
- 如果 lock 文件中包的版本和 package.json 中的不匹配：
  - install 可以正常执行（以 package.json 中的版本为准），并会更新 lock 文件
  - ci 失败并报错
- install 可以指定单独安装某个包，ci 不可以。
- 如果安装时已有 node_modules 目录，ci 会先删除此目录，install 不会。

## npm pack

[npm pack](https://docs.npmjs.com/cli/v10/commands/npm-pack)：Create a tarball from a package

测试 publish package 的效果时可以使用 npm pack，见 [《publish npm package》](post:712988a6-8046-4a13-acfb-23b33ceca90c#npmpack)

pack 后获得的 tarball 也可以直接作为依赖在其他项目中安装：见 [npm install 文档](https://docs.npmjs.com/cli/v9/commands/npm-install#description)中的 `npm install <tarball file>`

## npm doctor

[npm doctor](https://docs.npmjs.com/cli/v10/commands/npm-doctor) 检查你的 npm 环境是否健康（即是否具有管理 JavaScript 包所需的功能）

- 检查是否能够访问 registry（能否 ping 通）（是指你自己设置的 registry，可能不是官方的，值通过 npm config get registry 查看）
- 检查 node 和 npm 版本是否为最新(LTS)
- 检查 registry 是否为官方 registry（不使用官方 registry 这本身没有任何问题，此项检查只是提醒你这一点）
- 检查 PATH 中是否有 git（因为一些 npm 功能需要执行 git）
- 等等

## npm explain 和 npm ls

###### npm explain

[npm explain (alias: why)](https://docs.npmjs.com/cli/v10/commands/npm-explain)：Explain installed packages (in "bottoms up" view)

###### npm ls

[npm ls](https://docs.npmjs.com/cli/v10/commands/npm-ls)

- `npm ls` 列出项目中所有**直接**依赖
- `npm ls --all` 以 tree 形式列出项目中所有依赖（直接+间接依赖）
- `npm ls <package>` 列出项目中此 package（如果是间接依赖，则以 tree 形式展示）

## npm pkg

[npm pkg](https://docs.npmjs.com/cli/v10/commands/npm-pkg)：使用命令获取、设置、删除 package.json 中的值

```bash
npm pkg set <key>=<value>
npm pkg get <key>
npm pkg delete <key>
npm pkg fix
```

## npm outdated 和 npm update

###### npm outdated

[npm outdated](https://docs.npmjs.com/cli/v10/commands/npm-outdated)：检查当前安装的包是否 outdated。默认只检查直接依赖，使用 `-all` 同时检查所有依赖（直接+间接）

例：package.json 中依赖版本为：

```json
{
  "package-foo": "^1.3.1"
  "package-bar": "^3.5.1",
}
```

执行 npm outdated：

```bash
$ npm outdated
Package      Current Wanted  Latest
package-foo  1.3.2   1.3.3   1.3.3
package-bar  3.5.1   3.5.2   3.5.1
```

foo 包 outdated 了，应该升到 1.3.3 版本。这种情况可以删除 node_modules 然后重新 install，或者执行 `npm update` 命令更新。

bar 包的状态就比较奇怪了，Wanted 是 3.5.2，但 Latest 是 3.5.1，这是怎么回事呢？这是因为 Wanted 是 newest 版本，而 Latest 是名为 latest 的 dist-tag 指定的版本。这种情况下，重新 install 和 update 的结果就不同了：

- 删除 node_modules 然后重新 install：安装 latest（dist-tag），还是 3.5.1
- npm update：安装 newest 版本，即 3.5.2

###### npm update

[npm update](https://docs.npmjs.com/cli/v10/commands/npm-outdated)：更新所有 outdate 的包。

update 和 install 的区别：update 是安装最新版本的包，install 是安装 dist-tag 为 latest 的版本（当然都得在 semver range 内）

## npm prune

[npm prune](https://docs.npmjs.com/cli/v10/commands/npm-prune)：删除项目 node_modules 目录中存在但是没有使用的包。

正常情况下不再使用的包会自动删除。然而，在现实世界中，操作并不总是“正常”的。当发生崩溃或错误时，此命令可以帮助清理由此产生的垃圾。

## npm workspace

[npm workspace](https://docs.npmjs.com/cli/v10/using-npm/workspaces) 用来实现 monorepo。以后如果需要可以研究一下。

如果使用的是 pnpm，它有自己的 workspace 实现，见 [pnpm workspaces](https://pnpm.io/workspaces)

## npm shrinkwrap

[npm-shrinkwrap.json](https://docs.npmjs.com/cli/v10/configuring-npm/npm-shrinkwrap-json)：npm lock 文件。文件内容、作用都和 package-lock.json 相同，唯一的区别是可以被 publish（关于 publish package 时会 include、exclude 什么内容见[文章](post:712988a6-8046-4a13-acfb-23b33ceca90c)）

- 项目内没有 package-lock.json 和 npm-shrinkwrap.json 时，执行 `npm shrinkwrap` 会创建 npm-shrinkwrap.json。
- 项目内只有 package-lock.json 时，执行 `npm shrinkwrap` 会将 package-lock.json 重命名为 npm-shrinkwrap.json
- 项目只有 npm-shrinkwrap.json 时，再安装/删除依赖，都只会更新 npm-shrinkwrap.json 文件。
- 正常情况下项目中不会同时存在 package-lock.json 和 npm-shrinkwrap.json 文件。如果同时存在，npm-shrinkwrap.json 优先级更高。

注：[yarn](https://classic.yarnpkg.com/lang/en/docs/migrating-from-npm/) 和 [pnpm](https://pnpm.io/next/limitations) 都不支持 npm-shrinkwrap.json。

不建议 library 开发者使用、发布此文件，因为 that would prevent end users from having control over transitive dependency updates。只有在极少数情况下才考虑使用此文件：（下面是 npm 文档中的原文，我原样复制过来）

> The recommended use-case for npm-shrinkwrap.json is applications deployed through the publishing process on the registry: for example, daemons and command-line tools intended as global installs or devDependencies. It's strongly discouraged for library authors to publish this file, since that would prevent end users from having control over transitive dependency updates.
