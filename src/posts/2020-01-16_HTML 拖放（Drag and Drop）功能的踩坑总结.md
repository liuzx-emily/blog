---
id: 63100ee1-16ae-4f3a-9577-f5986675ee47
title: HTML 拖放（Drag and Drop）功能的踩坑总结
createTime: 2020-01-16
updateTime: 2020-01-16
categories: js
tags:
description:
---

> 一个典型的 drag 操作是这样开始的：用户用鼠标选中一个可拖动的（draggable）元素，移动鼠标到一个可放置的（droppable）元素，然后释放鼠标。
> 在操作期间，会触发一些事件类型，有一些事件类型可能会被多次触发（比如 drag 和 dragover 事件类型）

![在这里插入图片描述](..\post-assets\19fbf165-e96a-4dac-825c-2a915be00fb5.png)

具体的教程看这里：[HTML 拖放 API](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API)。非常详细！

下面是我个人的踩坑总结

---

1. 让一个元素被拖动，需要添加 draggable 属性：
   ```html
   <!-- 只写 draggale 不行，必须写全了： draggable="true" -->
   <section draggable="true"></section>
   ```
2. 想要让一个元素变成可释放区域，必须在 dragover 中阻止默认行为：
   ```js
   dropArea.addEventListener("dragover", (e) => {
     // 必须阻止默认事件，这里才会变成可释放区域。
     // 如果不写这一句，那么松手的时候，也不会触发相应的 drop 事件
     e.preventDefault();
   });
   ```
3. 拖拽外部文件进入浏览器并释放的时候，浏览器会执行一些默认行为。比如说，chrome 会预览图片文件，下载压缩包。所以需要在 drop 中阻止默认行为。
   ```js
   dropArea.addEventListener("drop", (e) => {
     e.preventDefault();
   });
   ```
4. 鼠标从父元素进入子元素时，会触发父元素的 dragleave

   ![在这里插入图片描述](..\post-assets\bc15d19d-bc37-4874-bd0f-473e1ec6a75f.png)

5. dataTransfer.setData(format, data) 的两个参数并不是 key 和 value !!!
   format：数据的类型。只能有两种值 `"text/plain"` 、`"text/uri-list"`
   dataTransfer.getData(format) 也是一样，format 也是只能为上面两种值
   ```js
   e.dataTransfer.setData("text/plain", "hello");
   e.dataTransfer.setData("text/plain", "world");
   const data = e.dataTransfer.getData("text/plain");
   console.log(data); // world
   ```
   如果想要存对象，自己转成字符串：
   ```js
   e.dataTransfer.setData("text/plain", JSON.stringify({ name: "emily", age: 11 }));
   const data = JSON.parse(e.dataTransfer.getData("text/plain"));
   console.log(data);
   ```
