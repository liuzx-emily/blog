---
id: 2144f0e9-eaa3-474e-9a52-d72c848d60e3
title: input[type='file'] 重复上传同一文件时，不会触发 change 事件
createTime: 2023-06-21
updateTime:
categories: js
tags:
description:
---

在获取到文件之后，清空 input.value

```html
<input type="file" onchange="afterSelectFile()" />

<script>
  function afterSelectFile() {
    if (event.target.files.length === 0) return;
    const file = event.target.files[0];
    event.target.value = ""; // 必须清空value。不然重复上传同一文件不会触发change事件。

    const data = new FormData();
    data.append("file", file);
    data.append("id", "1");
    // upload
  }
</script>
```
