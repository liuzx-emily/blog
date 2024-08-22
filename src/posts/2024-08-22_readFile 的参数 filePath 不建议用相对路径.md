---
id: 1fe91383-1c6a-4887-a0b5-9d9215fde91b
title: readFile 的参数 filePath 不建议用相对路径
createTime: 2024-08-22
updateTime:
categories: nodejs
tags:
description: 使用 nodejs 的 readFile writeFile 等方法时，参数 filePath 如果是相对路径，并不是相对于当前运行的文件，而是相对于 nodejs 当前的工作目录。建议使用 path.join(process.cwd()或__dirname,"")
---

使用 nodejs 原生的 `readFile` `writeFile` 等方法时，参数 filePath 如果是相对路径，并不是相对于当前运行的文件，而是相对于 nodejs 当前的工作目录（即 `process.cwd()`）

## 举例

`D:/test` 目录中新建 `index.js` 和 `apple.txt`。

index.js 读取并输出 apple.txt 的内容（apple）：

```js
import { readFile } from "node:fs/promises";

const res = await readFile("./apple.txt", { encoding: "utf-8" });
console.log(res);
```

在 `D:/test` 中执行 `node index.js`，输出 apple。

切换目录至 `D:/`，执行 `node test/index.js`，运行报错：

```bash
Error: ENOENT: no such file or directory, open 'D:\apple.txt'
```

从报错信息可以看出此时是直接在 `D:/` 下寻找 apple.txt，找不到就报错了。

## 解释

使用 readFile 等方法时，当文件路径是相对路径时，是相对 nodejs 当前工作目录

```js
// 下面两行代码是等价的
readFile("./apple.txt");
readFile(path.join(process.cwd(), "./apple.txt"));
```

所以，为了增强代码的可读性和健壮性，建议传参时不要用 `"./apple.txt"` 这种写法。下面提供两种建议写法

## 建议写法

### 相对于 process.cwd()

```js
import path from "node:path";
import process from "node:process";

path.join(process.cwd(), "相对于 nodejs 当前工作目录的路径");
```

### 相对于当前文件

###### commonjs 语法

在 commonjs 中可以直接获取 `__filename` 和 `__dirname`

```js
const { readFile } = require("node:fs/promises");
const path = require("node:path");

readFile(path.join(__dirname, "相对于当前文件的路径"), { encoding: "utf-8" }).then((res) => {
  console.log(res);
});
```

###### es module 语法

在 es module 中不能直接用 `__filename` 和 `__dirname`，会报错：

```bash
ReferenceError: __filename is not defined in ES module scope
```

通过 `import.meta.url` 迂回获取 `__filename` 和 `__dirname`

```js
import { readFile } from "node:fs/promises";
import path from "node:path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const res = await readFile(path.join(__dirname, "相对于当前文件的路径"), { encoding: "utf-8" });
console.log(res);
```
