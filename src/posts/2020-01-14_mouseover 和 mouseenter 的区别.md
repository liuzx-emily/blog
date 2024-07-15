---
id: be584edb-ea2c-44c1-a114-38c57faf0994
title: mouseover 和 mouseenter 的区别
createTime: 2020-01-14
updateTime: 2020-01-14
categories: js
tags:
description:
---

## 1 研究目标

当存在子元素时，父元素 `mouseover`和 `mouseenter` 的触发机制有什么不同？

注：

- mouseover 、 mouseout 是一对儿，机制相同。
- mouseenter 、 mouseleave 是一对儿，机制相同。

## 2 开始实验

页面结构如下：

```html
<section id="div1">
  <section id="div2"></section>
</section>
```

如下图 A、B、C 三个区域：A+B 是父元素 div1，A 是子元素 div2，C 是外部区域
![在这里插入图片描述](..\post-assets\82d584fa-bfc8-4193-a43f-228d541f9569.png)
实验结果：
![在这里插入图片描述](..\post-assets\a766fdfb-bdec-481a-8f74-b77626921c24.png)

## 3 总结

mouseover 和 mouseenter 的区别：

- mouseover 会冒泡，mouseenter 不冒泡。
- 鼠标在父子元素之间来回转悠时，会触发父元素的 mouseover ，不会触发父元素的 mouseenter
  ![在这里插入图片描述](..\post-assets\c1970d7a-4c1f-445b-8e99-e7a2532d975c.png)

所以：

1. 用 mouseover 的时候，要小心子元素的冒泡
2. 根据具体场景，来决定是用 mouseover ，还是 mouseenter ：
   - 从子晃悠到父元素时想要触发事件，就要用 mouseover。
   - 只有从外界进入父元素时才想触发事件，就要用 mouseenter
