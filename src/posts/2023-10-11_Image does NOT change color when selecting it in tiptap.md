---
id: 02394780-70e2-4bda-95ca-c3be2fd74528
title: Image does NOT change color when selecting it in tiptap
createTime: 2023-10-11
updateTime:
categories: css
tags:
description:
---

## Problem

What I want : <span style="color:darkorange">In the WYSIWYG editor, content changes color when selected.</span>

（The picture below is word, the background of the selected content turns gray.）

![在这里插入图片描述](../post-assets/f7de6bf6-b359-4816-bf65-1a93c2c2ca5a.png)

Normally, modern browsers support this effect by default. As shown below, the selected text and images all turn blue.

![在这里插入图片描述](../post-assets/cc965f94-0561-4628-ba80-54d2764065f2.png)

But in tiptap, the selected image does NOT change color.

![在这里插入图片描述](../post-assets/16068e83-325c-41ff-95ce-3dc0c1b4532e.png)

## Solution

In browser, `user-select` controls the **color changing** effect.

> The user-select CSS property controls whether the user can select text.

But for elements with `draggable = true` set, browsers will change the value of `user-select` to `none`(which makes sense when you think about it). Images in tiptap are draggable and therefore do not change color.

Solution is simple: just set `user-select` MANUALLY !

```css
.tiptap-container img {
  user-select: text;
}
```

![在这里插入图片描述](../post-assets/b773e58a-cbe8-4c2c-a3e4-48c2bed604c5.png)
