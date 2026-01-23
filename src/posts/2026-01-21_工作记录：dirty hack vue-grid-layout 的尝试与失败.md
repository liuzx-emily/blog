---
id: ede09934-78b6-486e-9405-0f762509188a
title: 工作记录：dirty hack vue-grid-layout 的尝试与失败
createTime: 2026-01-21
updateTime:
categories: 工作记录, 前端组件
tags: vue-grid-layout
series: 自研网格布局系统
description: 项目新需求“自定义页面内边距与组件间隙”，但 vue-grid-layout 的 prop.margin 存在“高度跳变”和“内外不分”的问题。尝试 dirty hack，但最终因为“负 marginBottom”和“背景图定位”无法解决而宣告失败。
---

## 背景与新需求

项目中的 `vue-grid-layout` 已稳定运行多年。接到新需求，需要支持：**页面内边距** 与 **组件间隙** 的自定义。

虽然 vue-grid-layout 原生支持 `prop.margin`，但在实际应用中存在两个硬伤：

1. **高度跳变**：`yMargin` 变化时，`GridItem` 的高度会发生巨幅变化（详见前序文章[《工作记录：vue-grid-layout 修改 margin 导致 item 高度剧烈变化》](post:c1024275-3886-4c99-9f80-7b8d0d17fe79)）
2. **内外不分**：`prop.margin` 会同时作用于“组件间隙”和“组件与外层容器的间距”。这导致无法实现“页面内边距 < 组件间隙”的效果

###### 考虑过自己造轮子吗？

考虑过，但在当时的情况下基本不可行：

- **工期与需求规模的错位**：这次要加的功能听起来并不复杂。当时项目正处于高强度开发阶段，对于这种“小改动”，不可能给出几个月的时间让我去重造轮子。
- **交互手感的复刻成本**：这类交互库的核心在于操作手感。项目已上线多年，用户已经习惯了 vue-grid-layout 的拖拽、缩放手感。这意味着不仅要造一个“能用”的新轮子，还要尽可能复刻原来的手感。这种“还原度”的要求让开发难度和工期又大幅增加。

综上，我决定不造轮子，而是尝试通过一些 workaround 手段（或者说 Dirty Hack）来硬怼出这个功能。

###### 核心红线：完美兼容旧数据

由于功能已上线多年，所以必须要**完美兼容用户以前的数据**。

具体来说：用户之前创建好的布局，不能因为这次更新产生任何偏差，1px也不行。在我们的项目中，每个项的内部内容和样式都非常复杂，尺寸微小的偏差也会影响效果。（举个例子：假设某项的高度和它内部内容的高度刚好匹配，但是更新后高度出现偏差，高度仅仅变小了1px，但就导致项内部出现滚动条，视觉效果大打折扣）

## 思路

为了规避“yMargin变化时，高度跳变”的问题，我保持传给 vue-grid-layout 的 `prop.margin` 固定为 `14px` 不变，采用下面的方案进行视觉模拟：

- **组件间隙**：将 `VueGridItem` 内部的组件设为 `absolute` 定位，通过修改 inset 来模拟组件间隙。

- **页面内边距**：在 `VueGridLayout` 外面多套一层，给这层设置 margin 来模拟页面内边距。**理论上** margin 可正、可负、可零，能完美对冲掉固定的 14px 的影响（其实不然，后面会说）

## 具体实现

**以前的结构：**
`div.wrapper > VueGridLayout > VueGridItem[] > myWidget`

```css
div.wrapper {
  /* wrapper 限高，可能会被 VueGridLayout 撑出滚动条 */
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}
.VueGridLayout {
  /* 用户可以设置背景图片。希望背景图片随着 VueGridLayout 滚动而滚动，所以背景图片要加在这一层。 */
  backgroundimage: v-bind(用户上传的背景图片);
}
.my-widget {
  /* 以前的myWidget尺寸完全和GridItem保持一致 */
  width: 100%;
  height: 100%;
}
```

**修改后的结构：**
`div.wrapper_outer > div.wrapper_inner > VueGridLayout > VueGridItem[] > myWidget`

```js
wrapperInner_style() {
  const offset = widgetMargin + 14 / 2;
  return {
    marginTop: pagePaddingTop * 2 - offset,
    marginBottom: pagePaddingBottom * 2 - offset,
    marginLeft: pagePaddingLeft * 2 - offset,
    marginRight: pagePaddingRight * 2 - offset,
    background: ...; // 背景图加在这一层
  };
}
myWidgetStyle(){
  return {
    position: 'absolute',
    // 消除固定 14px 的影响，除以2是因为要平分给两侧
    inset: `${widgetMargin - 14 / 2}px`
  }
},

```

## 最终翻车原因

这个看似可行的方案，最终遇到了两个无法逾越的问题：

1. **margin 对冲的局限性**：

   说个极端情况方便理解：将页面内边距设为0，且组件间隙不为0时，组件和页面上、左、右都能贴合，但**底部总会留下一条无法消除的空隙**。

   这是因为 `marginBottom` 为负值时，其行为逻辑和上、左、右不同，无法实现预期的“向下扩展”。

2. **背景图定位问题**：
   为了随内容滚动，背景图必须加在 `wrapper_inner` 这一层，但它会受 `margin` 的影响。以 `marginTop` 为例：
   - **`marginTop` < 0 时**：背景图随着容器整体上移，导致顶部被裁切显示不全。
   - **`marginTop` > 0 时**：背景图上方会出现留白，无法铺满。

由于上述两个问题无法解决，该尝试宣告失败。当时由于这两个功能优先级不高，便暂时搁置了。

## 补充说明

这篇记录的其实是 2024.04 的事情。当时写完[《工作记录：vue-grid-layout 修改 margin 导致 item 高度剧烈变化》](post:c1024275-3886-4c99-9f80-7b8d0d17fe79)）后我就立刻去尝试了，结果失败了。

之所以现在（2026年）才记录，是因为最近又接到了同样的需求——只不过这次给了较长的工期让我去造轮子了。这个造轮子的过程和我预想的一样漫长且痛苦，我打算开一篇文章专门记录。所以本文的内容作为“前传”，姑且记录一下。

> 由于是近两年前的记忆，部分细节可能存在遗漏，仅作思路记录。
