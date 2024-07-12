---
id: ffccefed-bc92-4a1a-a35e-b301972b0271
title: 设置 overflow:auto 的元素，会被内部的越界 absolute 元素撑出滚动条
createTime: 2021-07-06
updateTime: 2021-07-06
categories: css
tags: overflow
description: 元素A设置了宽高和 overflow:auto ，内部有 absolute 的元素 b。若b超出了A的宽高，那么A会出现滚动条
---

没什么好详细说的，直接上结论，后面放代码和演示吧

## 结论

==元素 A 设置了宽高和 overflow:auto ，内部有 absolute 的元素 b。若 b 超出了 A 的宽高，那么 A 会出现滚动条==（内部指后代元素，不仅仅指子级）

解决方法没找到，只能先避免这种结构了。（参考 element-ui 的 dropdown 组件，发现它的下拉菜单都是加到 body 下的，可能也是为了避免这个问题？）

---

## 演示

```html
<template>
  <section class="father">
    <section v-for="i in 3" :key="i" class="son">
      <span class="target"></span>
    </section>
  </section>
</template>
<style lang="scss" scoped>
  .father {
    margin: 0 auto;
    width: 250px;
    background: pink;
    padding: 20px;
    height: 220px;
    overflow: auto;
    .son {
      position: relative;
      height: 60px;
      line-height: 60px;
      margin-bottom: 15px;
      background: skyblue;
      .target {
        display: none;
        position: absolute;
        z-index: 1;
        top: 10px;
        left: 150px;
        width: 150px;
        height: 300px;
        background: red;
      }
    }
    .son:nth-last-child(1) {
      margin-bottom: 0;
    }
    .son:hover .target {
      display: block;
    }
  }
</style>
```

- 粉色 father（设置了 overflow:auto 和高度)
  - 多个蓝色 son（设置 relative)
    - 每个蓝色 son 有自己的红色 target（设置 absolute)

![在这里插入图片描述](..\post-assets\05b13409-2724-44d2-8051-22441a996193.png)