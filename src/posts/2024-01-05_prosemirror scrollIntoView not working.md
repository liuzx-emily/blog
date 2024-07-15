---
id: 50722a6b-c2be-464e-8adb-6fbea9f92e71
title: prosemirror scrollIntoView not working
createTime: 2024-01-05
updateTime: 2024-01-05
categories: prosemirror
tags:
description: 包起来了，但是 view.domAtPos 并不能找到这个 span，因为它是通过 decorations 添加上的，并不在 pm 的 dom 树中。它先找到页面上的 focusNode，以这个 node 为起点进行 scroll，挪完之后接着挪 parentNode，一步步向上找，逐级挪。想要在 pm 源码中看看具体如何实现的，搜索 scrollIntoView，只在	prosemirror-state 包中找到了很短的内容。在查找与替换弹窗中，点击“下一步”的箭头，此时页面的焦点在这个文本框中。
---

## 问题描述

prosemirror editor，开发**查找与替换**功能，点“下一个”时，希望 editor 自动滚动到结果所在位置。

![在这里插入图片描述](..\post-assets\48157a78-3a40-4780-aa7c-7dc0b5ac8217.png)
查找 prosemirror 文档，找到了 [scrollIntoView()](https://prosemirror.net/docs/ref/#state.Transaction.scrollIntoView)

> Indicate that the editor should scroll the selection into view when updated to the state produced by this transaction.

```js
tr.setSelection(TextSelection.create(doc, from, to)).scrollIntoView();
dispatch(tr);
```

但实际使用无效，editor 不会滚动，也没有任何报错。

---

## 查找源码

想要在 pm 源码中看看具体如何实现的，搜索 scrollIntoView，只在 prosemirror-state 包中找到了很短的内容

```js
  /// Indicate that the editor should scroll the selection into view
  /// when updated to the state produced by this transaction.
  scrollIntoView(): this {
    this.updated |= UPDATED_SCROLL
    return this
  }
```

再想继续找已经找不到了。

换个思路，决定写一个简单的 case，看看能不能触发滚动。如果能触发滚动，监听 scroll 事件并打断点，就能找到 pm 触发滚动的语句了！

```html
<input type="button" value="scroll" @click="clickScroll" />
<script>
  function clickScroll() {
    window.view.dispatch(window.view.state.tr.scrollIntoView());
  }
  onMounted(() => {
    // 因为 height 和 overflow:auto 是加在 #editor 上的，所以要监听它的 scroll
    document.querySelector("#editor").addEventListener("scroll", (e) => {
      debugger;
    });
  });
</script>
```

在 editor 中选中一部分内容，然后滚动到不可见的位置。点击按钮——成功滚动！在 scroll 事件中 debugger，查看 call stack 成功找到了 pm 相关代码：

![在这里插入图片描述](..\post-assets\e643d8d9-77a7-4ca2-a811-81a64e6f690d.png)

---

## 阅读源码，发现问题

scrollIntoView 的方法描述说会把 **selection** 滚动到可视区域。

但在查看源码后发现， 这里的 **selection** 并不是指 pm editor 的 Selection，而是页面的 selection！

它先找到页面上的 focusNode，以这个 node 为起点进行 scroll，挪完之后接着挪 parentNode，一步步向上找，逐级挪。

```js
// prosemirror-view 包
function scrollToSelection() {
  let startDOM = document.getSelection().focusNode;
  if (this.someProp("handleScrollToSelection", (f) => f(this)));
  else if (pmSelection instanceof NodeSelection) {
    let target = this.docView.domAfterPos(this.state.selection.from);
    if (target.nodeType == 1) scrollRectIntoView(this, target.getBoundingClientRect(), startDOM);
  } else {
    scrollRectIntoView(this, this.coordsAtPos(this.state.selection.head, 1), startDOM);
  }
}

function scrollRectIntoView(view, rect, startDOM) {
  let scrollThreshold = view.someProp("scrollThreshold") || 0,
    scrollMargin = view.someProp("scrollMargin") || 5;
  let doc = view.dom.ownerDocument;
  for (let parent = startDOM || view.dom; ; parent = parent.parentNode) {
    if (!parent) break;
    if (parent.nodeType != 1) continue;
    let atTop = parent == doc.body;
    let bounding = atTop ? windowRect(doc) : clientRect(parent);
    let moveX = 0,
      moveY = 0;
    // 略...根据 rect 和 bounding 计算 moveX 和 moveY
    if (moveX || moveY) {
      if (atTop) {
        window.scrollBy(moveX, moveY);
      } else {
        let startX = parent.scrollLeft,
          startY = parent.scrollTop;
        if (moveY) parent.scrollTop += moveY;
        if (moveX) parent.scrollLeft += moveX;
        let dX = parent.scrollLeft - startX,
          dY = parent.scrollTop - startY;
        rect = {
          left: rect.left - dX,
          top: rect.top - dY,
          right: rect.right - dX,
          bottom: rect.bottom - dY,
        };
      }
    }
    // 如果发现 parent 是 fixed 或者 sticky，终止挪动！
    if (atTop || /^(fixed|sticky)$/.test(getComputedStyle(parent).position)) break;
  }
}
```

在查找与替换弹窗中，点击“下一步”的箭头，此时页面的焦点在这个文本框中。

![在这里插入图片描述](..\post-assets\f2e1ee2c-4c7a-44ca-94a9-9c491b597a12.png)

pm 的 scrollRectIntoView 内部变量 `startDOM` 就是这个文本框，滚动的是这个文本框和它的祖先！这当然没效果了！

---

## 解决

在 `scrollToSelection` 方法中看到，一上来先调用了 `view.EditorProps.handleScrollToSelection`。我想到可不可以：在想要自定义 scroll 时，用 tr.setMeta() 给 tr 设置信息。在`handleScrollToSelection` 中 用 `tr.getMeta()` 接受信息，内部自己处理 scroll。但是仔细一看，handleScrollToSelection 的入参只有 view，并没有 tr。失败

最终决定不用 pm 提供的 scroll，也不重写它的方法。完全自己 scroll：根据 prosemirror 的位置 pos，通过 `view.domAtPos(pos)` 找到对应的 dom 节点，调用 html 方法 `node.scrollIntoView()`

```js
export function findNext() {
  return (state, dispatch) => {
    activeIndex.value += 1;
    dispatch(state.tr); // 为了触发deco更新手动派发tr
    scrollToActiveResult(); // 上一行 dispatch(tr) 后同步调用 decorations()。所以走到本行时，results 和 activeIndex 都已经在 decorations 中算好了，是最新的，可以放心用。
  };
}

function scrollToActiveResult() {
  const pos = results.value[activeIndex.value]?.from;
  if (pos) {
    scrollIntoViewByPmPos(pos);
  }
}

function scrollIntoViewByPmPos(pos) {
  const { node } = window.view.domAtPos(pos);
  if (node) {
    node.scrollIntoView?.(); // 滚动使 node 顶部与可视区域顶部对齐
  }
}
```

上述方法有一个问题：
通过 domAtPos 找到的 dom ，它的顶部位置和 pos 的位置是不同的。可能相差很远

举一个极端的例子：假设存在一个非常长的节点 p，它本身的高度就已经超过可视区域了。
查询时点击下一个，在 p 的末尾发现了匹配的文本 a 。此时 a 不在可视区，需要滚动。但是通过 `view.domAtPos(pos)` 找到的是 p 元素，这时会向上滚动使 p 的顶端对齐可视区。

![在这里插入图片描述](..\post-assets\5a8728c1-97b6-4e08-bdc8-163ef6e2118a.png)

解释一下，p 末尾的文本 a 虽然被高亮显示了，被 `span.active-find` 包起来了，但是 view.domAtPos 并不能找到这个 span，因为它是通过 decorations 添加上的，并不在 pm 的 dom 树中。

## 解决（！）

既然 pm 不认这个 span.active-find，那我自己找就好了

```js
function scrollToActiveResult() {
  const node = document.querySelector(".active-find");
  node?.scrollIntoView();
  //const pos = results.value[activeIndex.value]?.from;
  // if (pos) {
  // scrollIntoViewByPmPos(pos);
  //}
}
```
