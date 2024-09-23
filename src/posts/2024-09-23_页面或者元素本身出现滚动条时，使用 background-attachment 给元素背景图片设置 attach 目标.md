---
id: 071dc549-397f-462e-8796-4e45a39b9f9d
title: 页面或者元素本身出现滚动条时，使用 background-attachment 给元素背景图片设置 attach 目标
createTime: 2024-09-23
updateTime:
categories: css
tags:
description:
---

## 属性值含义

设置了 background-image 后，可以通过 `background-attachment` 控制图片 attach 到哪，有三个值：

- `scroll` : The background is fixed with regard to the box itself and does not scroll with its contents. (It is effectively attached to the box's border.)

- `fixed` : The background is fixed with regard to the **viewport**.

- `local` : The background is fixed with regard to the box's contents: if the box has a scrolling mechanism, the background scrolls with the box's contents, and the background painting area and background positioning area are relative to the scrollable overflow area of the box rather than to the border framing them.

## 具体应用

background-attachment 默认值为 scroll，背景图片 attach 元素 box 本身。当**页面**或者**元素本身**出现滚动条时，背景图片可以有不同的 attach 策略：

### 页面出现滚动条 scroll/fixed

当页面内容超出视窗高度时，页面出现滚动条。

页面滚动时，背景图片可以 attach 元素 box 本身（`scroll`），也可以 attach 视窗（`fixed`）：

<iframe src="https://liuzx-emily.github.io/blog-demo/background-attachment-fixed/"></iframe>

### 元素本身出现滚动条 scroll/local

当元素的内容超过元素 box 高度时，元素 box 出现滚动条。

元素的内容滚动时，背景图片可以 attach 元素 box 本身（`scroll`），也可以 attach 元素内容(`local`）

<iframe src="https://liuzx-emily.github.io/blog-demo/background-attachment-local/"></iframe>

## 兼容性

实测 iphone 的 safari 不支持 fixed 属性。

注意：在 [mdn](https://developer.mozilla.org/en-US/docs/Web/CSS/background-attachment#browser_compatibility) 或者 [can i use](https://caniuse.com/?search=background-attachment) 上查看兼容性时，有两种 Safari：

- Safari
- Safari on IOS（iphone 属于这项）
