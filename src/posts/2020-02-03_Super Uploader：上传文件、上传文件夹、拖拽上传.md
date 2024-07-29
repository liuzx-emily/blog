---
id: e804da0f-9378-4047-83f7-ec37487f2cd9
title: Super Uploader：上传文件、上传文件夹、拖拽上传
createTime: 2020-02-03
updateTime: 2024-07-29
categories: js
tags:
description:
---

[在线预览](https://liuzx-emily.github.io/playground/#/super-uploader)，[源码](https://github.com/liuzx-emily/playground/tree/main/src/views/super-uploader)

## 上传文件

```html
<!-- 添加 multiple 属性，可以同时选择多个文件 -->
<input type="file" multiple id="uploadFile" @change="handleChange" />
```

```js
function handleChange() {
  let files = document.getElementById("uploadFile").files; // FileList 伪数组对象
  for (let i = 0; i <= files.length - 1; i++) {
    let file = files[i]; // File 对象
    console.log(file);
  }
}
```

## 上传文件夹

```html
<!-- 添加 webkitdirectory 属性，上传文件夹 -->
<input type="file" webkitdirectory id="uploadDir" @change="handleChange" />
```

```js
function handleChange() {
  // 这里获取到的 files 已经包括了子级目录中的文件（子级、子子级、子子子级等），所以不需要自己递归获取。
  let files = document.getElementById("uploadDir").files;
  for (let i = 0; i <= files.length - 1; i++) {
    let file = files[i];
    console.log(file); // file.webkitRelativePath 属性是文件的相对路径
  }
}
```

## 拖拽上传

在 drop 事件中通过 `e.dataTransfer.items` 递归获取拖拽的文件（夹）。具体看[《拖拽文件夹到浏览器中，展示所有文件层级》](post:630091a6-0906-4fd2-9053-4b0f2c839794)

## 统一路径格式

这三种上传途径，最终都拿到 File 对象。但是文件的相对路径格式不统一，需要处理，统一格式为 **dir1/dir2/a.txt**

| 途径       | 相对路径                      | 说明                                                                        |
| :--------- | :---------------------------- | :-------------------------------------------------------------------------- |
| 拖拽上传   | `entry.fullPath.substring(1)` | file.webkitRelativePath 是空。<br>用 entry.fullPath，注意把最前面的斜杠去掉 |
| 上传文件   | `file.name`                   | file.webkitRelativePath 是空。<br>直接用 file.name                          |
| 上传文件夹 | `file.webkitRelativePath`     | file.webkitRelativePath 就是想要的格式，直接用                              |

## 性能优化

同时计算几千个文件的 md5 值时页面卡顿崩溃，怎么解决？通过分块、排队、web-worker 缓解计算压力；添加分页或虚拟列表缓解渲染压力。

具体看 [《批量计算文件 md5 时页面卡顿，如何解决？》](post:023a76e9-c7e0-4f47-87e5-bfad786be472)
