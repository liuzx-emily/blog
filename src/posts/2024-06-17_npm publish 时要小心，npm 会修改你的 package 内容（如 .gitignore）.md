---
id: 271015ca-d7a2-4a0d-a351-fbc598acfdbe
title: npm publish 时要小心，npm 会修改你的 package 内容（如 .gitignore）
createTime: 2024-06-17
updateTime: 2024-06-17
categories: 底层工具
tags: npm
description: 在 npm 上发布包时，使用 files 字段和 .npmignore 指示你想要包含哪些文件。但是有部分内容是 npm 强制包含或排除的，你无法改变。并且在别人安装你的包时，npm还会把 .gitignore 文件强制改名为 .npmignore，这给很多 generator 项目带来麻烦。
---

在 npm 发布 package 时，可以使用 **packge.json 的 files 字段(白名单)** 和 **.npmignore 文件(黑名单)** 告诉 npm 你想包含哪些文件。但是你的决定权是**有限**的，有一部分内容是 npm 强制包含或排除的，无论你怎么设置都无法改变。

如果说上述行为算是可以理解的，那么下面的操作就让人难以接受了：在别人使用 npm install 安装你发布的包时，npm 会修改你包中的文件！——说的就是 `.gitignore` ，npm 会把它自动重命名为 `.npmignore`。
这对普通项目可能影响不大，但是对于 generator 就影响很大了（比如我的[脚手架](https://blog.csdn.net/tangran0526/article/details/139417312)）。而且这一自动重命名的行为是强制的，你无法通过任何设置取消。
generator 中 .gitignore 问题的解决方案：generator/template 中的 .gitignore 改名为 gitignore，在构建时自动改回来

---

## npm 强制行为

将 package 发布到 npm registry 时，npm 强制包含/排除的内容：

### 发布时强制包含

- package.json
- README（大小写任意，后缀任意）
- LICENSE / LICENCE（大小写任意，后缀任意）
- The file in the "main" field
- The file(s) in the "bin" field

### 发布时强制排除

- .git
- .npmrc
- node_modules
- package-lock.json
- pnpm-lock.yaml
- yarn.lock

### 安装时强制改名

在别人安装你的包时，如果包含 .gitignore 文件，npm 会强制重命名为 .npmignore

---

## package.json 的 files 字段

白名单。

默认为`["*"]`，即包括所有内容（官方文档是这么写的，但是经我实际测试不设置 files 字段和设置 `files:["*"]` 的行为是不同的。见下面的测试 2）

---

## .npmignore 文件

黑名单。

如果没有 `.npmignore` 文件，但有 `.gitignore` 文件，那么 npm 将使用 .gitignore 文件的规则。如果想要包含 .gitignore 文件中排除的内容，可以创建一个空的 .npmignore 文件来覆盖它。与 git 一样， npm 在包的所有子目录中查找 .npmignore 和 .gitignore 文件，而不仅仅是根目录。

以下内容是 npm 默认忽略的，不需要在 .npmignore 文件中设置。如果想要包含这些内容，可以在 files 字段中设置：

- .\*.swp
- .\_\*
- .DS_Store
- .gitignore（很特殊！可以发布到 registry 上，但是安装到本地后会被重命名为 .npmignore)
- .hg
- .npmignore
- .lock-wscript
- .svn
- .wafpickle-\*
- config.gypi
- CVS
- npm-debug.log

（注：名单可能不全。我是在 npm 官方文档里找到的这个名单。官网里有两篇内容里都出现了这个名单，但内容不一致，所以完整性存疑。）

---

## 测试

### 测试 1：未设置 files 字段

本地结构：

![在这里插入图片描述](..\post-assets\e682d911-a5d6-4b93-8cb8-849880e43ee7.png)

发布之后，在 npm registry 看到的内容。并且也是使用 npm install 安装到本地的内容：

![在这里插入图片描述](..\post-assets\9bd0af8c-0c11-4305-871a-bceb867b7f6a.png)

对比图：

![在这里插入图片描述](..\post-assets\ab0d316c-d151-4c62-b339-2b28f1e05f28.png)

发布的内容中不包含 `node_modules`、`.gitignore` 和 `package-lock.json`

### 测试 2：设置 `files: ["*"]`

在 package.json 中添加 `files: ["*"]`

发布后在 npm registry 上查看内容。和测试 1 的结果比较，多了 .gitignore 文件：

![在这里插入图片描述](..\post-assets\3819e2ed-0a79-44a0-8576-69a7e13d081f.png)

这说明不设置 files 字段与设置 ` "files": ["*"]` 的行为并不是完全一致的。（.gitignore 文件的不同效果是我无意中测试出来的，至于其他还有哪些文件受影响我也不知道，没有在官方文档中找到相关说明）

使用 `npm install` 安装这个包，可以看到 .gitignore 被自动改名为 .npmignore 了：

![在这里插入图片描述](..\post-assets\c2c05f33-504d-4403-a3bf-0a9c5e5e2af4.png)

### 测试 3：修改 files

在测试 1 中有三个文件（夹）被排除了。
假设有一个萌萌开发者，想把这三个文件也包含进来，他修改 files 字段：

```json
  "files": [
    "node_modules/",
    ".gitignore",
    "package-lock.json"
  ],
```

发布后在 npm registry 上查看：
![在这里插入图片描述](..\post-assets\06d9b793-496c-4739-ab92-46e8eafe51e9.png)
只留下了三个文件！

因为在未设置 files 时，默认包含所有文件。一旦你设置了 files 字段，那么将只包含你设置的内容了！更明确一点，是 **npm 强制包含的内容** + **在 files 字段设置了且不是被 npm 强制排除的内容**。具体在这个例子中：

- 《npm 强制包含的内容》：`package.json` `index.js`（因为我在 package.json 中设置了`"bin": "./index.js"`）
- 《在 files 字段设置了且不是被 npm 强制排除的内容》：`.gitignore`

files 字段中设置的 `node_modules` 和 `package-lock.json` 都是被 npm 强制排除的，所以设置也无效。

别人安装这个包得到的内容：.gitignore 依然被重命名为 .npmignore 了

![在这里插入图片描述](..\post-assets\fd6c3f8a-0d14-44c7-ad21-5b723f264ff2.png)

---

## 利用 npm pack 测试

研究这个问题还是挺麻烦的。需要一遍遍的修改本地文件，发布，再去 npm registry 上查看。

幸好我在查资料的时候，发现 `npm publish` 和 `npm pack` 在这个问题上总是被一起讨论。`npm pack` 是打压缩包，看了下源码发现 publish 和 pack 都是调用相同的内部方法。所以可以用 pack 替代 publish 进行测试！这就方便许多了。

执行 `npm pack`，得到一个 .tgz 压缩包，解压后就可以看到所有内容了：

![在这里插入图片描述](..\post-assets\d8051484-107c-428e-9389-9bee29beabce.png)

注意：pack 模拟的是发布到 npm registry 的内容，而别人下载后看到的内容无法通过 pack 模拟得知。所以你在上图看到的是 .gitignore，而不是 .npmignore

---

## 参考资料

- npm 文档：[Keeping files out of your package](https://docs.npmjs.com/cli/v6/using-npm/developers#keeping-files-out-of-your-package)
- npm 文档：[package.json - files](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#files)

- issues opened by npm founder：[Rename .gitignore to .npmignore in package if no .npmignore found](https://github.com/npm/npm/issues/1862)
