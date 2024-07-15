---
id: 4423fcb6-3ed6-4073-ad2a-0b9294c7af31
title: position:absolute + scrolling
createTime: 2021-07-06
updateTime: 2021-07-06
categories: css
tags:
description:
---

## 问题

父级 `.father` 被子元素 `.son` 撑出了滚动条；另一个子元素 `.target` 被绝对定位在父级 `.father` 的右下角。
当 `.father` 滚动时，`.target` 不再固定在右下角，而是跟着动
![在这里插入图片描述](..\post-assets\478d93a1-c876-472b-8d4b-0d487247abfa.png)

```html
<template>
  <section class="father">
    <section class="son"></section>
    <span class="target"></span>
  </section>
</template>
<style lang="scss" scoped>
  .father {
    width: 500px;
    height: 300px;
    overflow: auto;
    position: relative;
    background: skyblue;
    .son {
      height: 700px;
    }
    .target {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 50px;
      height: 50px;
      background: red;
    }
  }
</style>
```

## 解决方法

多套一层，保证 absolute 元素的父级不会出现滚动条

```html
<template>
  <section class="father">
    <section class="scroll-container">
      <section class="son"></section>
    </section>
    <span class="target"></span>
  </section>
</template>
<style lang="scss" scoped>
  .father {
    width: 500px;
    margin: 0 auto;
    position: relative;
    height: 300px;
    background: skyblue;
    .scroll-container {
      height: 100%;
      overflow: auto;
      .son {
        height: 700px;
      }
    }
    .target {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 50px;
      height: 50px;
      background: red;
    }
  }
</style>
```

![在这里插入图片描述](..\post-assets\280f9431-219f-49ed-9ed6-463e3b4ce7c5.png)

参考：
[stackoverflow - Position Absolute + Scrolling](https://stackoverflow.com/questions/17656623/position-absolute-scrolling)
