---
id: b7c76f95-b52d-4c56-a58a-db7dd6c54d2b
title: 请求一直处于 pending 状态（Max parallel http connections in a browser）
createTime: 2021-06-18
updateTime:
categories:
tags: browser
description: 浏览器同时发出的请求是有数量上限的（chrome中是6个），超过上限后需排队等待，即 pending 状态
---

## 问题描述

多文件分块上传时可能同时触发非常多 ajax 请求。

打开 F12 发现，同一时刻只会有几个（目测不超过十个）请求在正常工作，其余的都处在 **pending** 状态

## 原因

根据 [chrome developers docs](https://developer.chrome.com/docs/devtools/network/reference/#timing-explanation)：

![在这里插入图片描述](../post-assets/9b0c5094-ffb3-4622-ad99-f89f7988af44.png)

对于不同的浏览器或者同一浏览器的不同版本，这个数值是不同的。

其他参考：
[StackOverflow - How many concurrent AJAX (XmlHttpRequest) requests are allowed in popular browsers?](https://stackoverflow.com/questions/985431/max-parallel-http-connections-in-a-browser)
