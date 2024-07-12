---
id: 6b97d16e-73ae-4ca8-8b83-fb4768bbf27c
title: prosemirror 学习记录（三）tooltip
createTime: 2023-10-25
updateTime: 2023-10-25
categories: prosemirror
tags: 
description: 学习实现 prosemirror tooltip
---

[prosemirror Tooltip example](https://prosemirror.net/examples/tooltip/)

自己写的版本：

```js
import { Plugin } from "prosemirror-state";

export const MyTooltipPlugin = new Plugin({
  view(view) {
    const tooltip = document.createElement("div");
    tooltip.classList.add("my-custom-tooltip");
    view.dom.parentNode.appendChild(tooltip);
    return {
      update(view, prevState) {
        const selection = view.state.selection;
        console.log(selection);
        if (selection.empty) {
          tooltip.style.display = "none";
          return;
        }
        tooltip.style.display = "block";
        const selectionFragment = view.state.doc.cut(selection.from, selection.to);
        const length = selectionFragment.textContent.length;
        tooltip.innerText = length;
        tooltip.style.left = view.coordsAtPos(selection.from).left + 10 + "px";
        tooltip.style.top = view.coordsAtPos(selection.from).top - 30 + "px";
      },
    };
  },
});
```

```css
.my-custom-tooltip {
  border: 1px solid #ddd;
  background: white;
  position: absolute;
  font-size: 12px;
}
```

效果：
![在这里插入图片描述](..\post-assets\e0991e34-943b-4d66-ab4c-6a6f01ab05b4.png)

关键点：

- Plugin - view - update
- view.dom.parentNode.appendChild
- view.coordsAtPos
- view.state.doc.cut 获取选区 fragment，再通过 textContent.length 获取文本长度

官网代码不同之处：

- ```js
  // Don't do anything if the document/selection didn't change
  if (lastState && lastState.doc.eq(state.doc) && lastState.selection.eq(state.selection)) {
    return;
  }
  ```

- 官方示例中用 `selection.to - selection.from` 计算选区长度，和我的方法得到的结果不一样。我的方法获取的是纯文本的长度，`to - from` 获取的不止文字长度。按需选择。
- 官方示例计算位置时减去了父容器的偏移量。它这样算才是对的，因为 coordsAtPos 是相对屏幕的。