---
id: 25406e63-d2c8-4a1a-88e2-f89d56db3307
title: 工作记录：prosemirror 再战 word 列表，成功！
createTime: 2023-10-27
updateTime: 2023-10-27
categories: 工作记录, prosemirror
tags: 
description: 最近又学习了 prosemirror，自认有些进步 —— 从只了解 1% 变成掌握 20%，决定再次挑战 word 列表。之前的尝试失败了，过程记录在中，简单总结如下：实现 word 列表不能用 ul>li，必须用平级标签，从而需要自行计算列表序号。我需要写一个计算序号的方法，view 每次变化时调用此方法修改序号。方法成功写出来了，但是我找不到地方去调用它！这次重新挑战，bye bye tiptap，我直接用 prosemirror。
---

最近又学习了 prosemirror，自认有些进步 —— 从只了解 1% 变成掌握 20%，决定再次挑战 word 列表。
之前的尝试失败了，过程记录在 [工作记录：在线 word - 列表](https://blog.csdn.net/tangran0526/article/details/130843375) 中，简单总结如下：实现 word 列表不能用 ul>li，必须用平级标签，从而需要自行计算列表序号。我需要写一个计算序号的方法，view 每次变化时调用此方法修改序号。`getListItemNumber` 方法成功写出来了，但是我找不到地方去调用它！

这次重新挑战，bye bye tiptap，我直接用 prosemirror。

## listItem schema

第一步，先写列表项的 schema

```js
 myWordList: {
    content: "inline*",
    group: "block",
    attrs: {
      listId: {},
      listItemlevel: {},
      listItemNumber: {},
    },
    parseDOM: [
      {
        tag: "p[list-id]",
        getAttrs(dom) {
          return {
            listId: dom.getAttribute("list-id"),
            listItemlevel: dom.getAttribute("list-item-level"),
            listItemNumber: dom.getAttribute("list-item-number"),
          };
        },
      },
    ],
    toDOM(node) {
      const { listItemlevel, listItemNumber, listId } = node.attrs;
      return [
        "p",
        {
          "list-id": listId,
          "list-item-level": listItemlevel,
          "list-item-number": listItemNumber,
        },
        0,
      ];
    },
  },
```

css

```css
/* 列表编号 */
p[list-id]::before {
  content: attr(list-item-number);
  color: red;
}
```

添加到 schema 中：

```js
import { schema } from "prosemirror-schema-basic";
import MyWordListSchema from "./MyWordListSchema";

const mySchema = new Schema({
  nodes: schema.spec.nodes.prepend({ ...MyWordListSchema.nodes }),
  marks: schema.spec.marks,
});
```

关键点有三个：

- `group: "block"`
  我使用的 schema 是在 prosemirror-schema-basic 基础上扩展的。这个 basicSchema 中 doc 是这样设置的：
  ```js
   doc: {
        content: "block+"
    },
  ```
  在不改动 doc 设置的前提下，为了让列表项能放在 doc 下，必须将其 group 设置为 `block`
- `content: "inline*"` 必须显示设置 content 值

- 添加时必须用 `prepend`
  列表项的 parseDOM 是 `tag: "p[list-id]"`，普通段落的 parseDOM 是 `tag: "p"`。
  对于`<p list-id="1">abc</p>` ，列表项和普通段落都会认为是自己的类型，这时候就看谁优先级更高了。优先级是由 schema.nodes 中的顺序决定的。
  用 prepend 添加，列表项的优先级更高，保证 `<p list-id="1">abc</p>` 被判定为列表项

## 实现序号

### 方案一：Plugin view

最近学习 prosemirror 我知道了可以用 Plugin view 实现在 view 每次变化时做处理。试一试：

```js
new Plugin({
  view() {
    return {
      update(view) {
      	// processDoc_getListNumber(doc,handler:(node,pos,numberArr)=>{}) 计算列表序号
        processDoc_getListNumber(view.state.doc, (node, pos, numberArr) => {
          // console.log(node, pos, numberArr);
          node.attrs.listItemNumber = numberArr;
        });
      },
    };
  },
}),
```

写完测试，不成功：`node.attrs.listItemNumber` 的值成功修改了。但是节点不会重新渲染（没有触发 toDom），dom 中的 `list-item-number` 属性值并没有更新。

如果妄想在 update 中使用 `dispatch(tr)` 显示触发视图更新，那么就等着死循环吧！无限执行 Plugin update，根本不会进 toDom。所以想在 update 或者 toDom 中设置条件让死循环停下来是不可能的！

### 方案二：Plugin decoration

上一个方案失败了。看来关键就是：只修改数据（node.attrs）不行，必须想办法直接改视图（修改原生 dom 的属性值）

突然想起来 decoration 好像可以做到：

```js
new Plugin({
  props: {
    decorations(state) {
      const arr = [];
      processDoc_getListNumber(state.doc, (node, pos, numberArr) => {
        arr.push(
          Decoration.node(pos, pos + node.nodeSize, {
            "list-item-number": numberArr.join("."),	// 这里直接修改 dom 属性值
            style: `margin-left:${node.attrs.listItemlevel * 18}px`,	// 顺便把缩进处理了
          })
        );
      });
      return DecorationSet.create(state.doc, arr);
    },
  },
}),
```

这样写完全用 Decoration 去处理编号，已经不需要在 node.attrs 中存储编号了，可以直接去掉

```js
// schema
myWordList: {
  attrs: {
    listId: {},
    listItemlevel: {},
    // listItemNumber: {},	// 直接去掉！没用了
  },
```

成功！

效果：

![在这里插入图片描述](..\post-assets\bfc7a67a-2e7e-4fc5-b7f7-84b4849b1273.png)

---

插一句：`plugin` 的 view-update 和 decorations 都会在编辑器状态改变时响应。区别在于：

- decorations 的功能是：==允许你在编辑器状态改变时，再对编辑器内容做一些额外修改。并且使用 decorations 进行的修改不会真正编辑器状态==所以它适合用来修改编辑器内容，比如修改列表序号、查找时高亮内容。
- view-update 的功能是：==在编辑器内容发生变化时通知你，你自己在外部做点什么==，比如修改菜单按钮的状态。你不能用它来修改编辑器内部的东西。如果在 view-update 中强行调用 `dispatch(tr)`会触发死循环

---

-

## 添加 commands

关键难题已经解决，后面就是按部就班加上常用命令：调整列表等级，将普通段落变为列表等

### 调整列表等级

```html
<input type="button" value="<-" @click="fatherLevel" />
<input type="button" value="->" @click="sonLevel" />
```

```js
function changeListItemLevel(handler) {
  return function (state, dispatch) {
    const tr = state.tr;
    const selection = state.selection;
    state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
      if (node.type.name === "myWordList") {
        let level = handler(node);
        if (level < 0) level = 0;
        tr.setNodeAttribute(pos, "listItemlevel", level);
      }
    });
    dispatch(tr);
  };
}

function sonLevel() {
  editorView.value.focus();
  const state = editorView.value.state;
  const dispatch = editorView.value.dispatch;
  changeListItemLevel((node) => parseInt(node.attrs.listItemlevel) + 1)(state, dispatch);
}

function fatherLevel() {
  editorView.value.focus();
  const state = editorView.value.state;
  const dispatch = editorView.value.dispatch;
  changeListItemLevel((node) => parseInt(node.attrs.listItemlevel) - 1)(state, dispatch);
}
```

关键点：

- `tr.setNodeAttribute` 指的不是 HTML Attributes，而是数据 node.attrs
  一开始写成了 `"list-item-level"` debug 了一下午，无语。。。
- 想要点击按钮后，编辑器不失去焦点，有两种方法：
  1.  手动 focus 回来：`editorView.value.focus();`
  2.  按钮上不用 click。改用 mousedown，并且阻止默认事件，这样编辑区的焦点就不会丢了。参考： [Why are menu functions executed on mousedown?](https://discuss.prosemirror.net/t/why-are-menu-functions-executed-on-mousedown/2923)

效果：

![在这里插入图片描述](..\post-assets\0150f28c-6e92-4851-8ed7-dc569f9f357c.png)

### 添加快捷键

```js
plugins: [
  keymap({
    Tab: changeListItemLevel((node) => parseInt(node.attrs.listItemlevel) + 1),
    "Shift-Tab": changeListItemLevel((node) => parseInt(node.attrs.listItemlevel) - 1),
  }),
];
```

关键点

- commands 最后必须 `return true`，非常重要。这会阻止后续 handlers 执行。浏览器默认事件可以看作最后一个 handler，所以也会被阻止。如果没有 return true。点击 Tab 或 Shift+Tab 后浏览器会执行默认操作（切换焦点）

```js
function changeListItemLevel(handler) {
  return function (state, dispatch, view) {
    ...
    dispatch(tr);
    return true; // 添加上 return true
  };
}
```

效果：

![在这里插入图片描述](..\post-assets\0624fa9a-8861-4ae0-b6b9-6686406ded39.png)

### 切换为列表

```html
<input type="button" value="转为列表" @mousedown.prevent="setListItem" />
<input type="button" value="转为段落" @mousedown.prevent="setParagraph" />
```

```js
import { setBlockType } from "prosemirror-commands";

function setListItem() {
  const state = editorView.value.state;
  const dispatch = editorView.value.dispatch;
  return setBlockType(mySchema.nodes.myWordList, {
    listId: "1", // 这里只是简单示意。可以扩展成更复杂的：listId 跟随最近的列表项，或者使用全新的listId等等（新起列表）
    listItemlevel: 0,
  })(state, dispatch);
}

function setParagraph() {
  const state = editorView.value.state;
  const dispatch = editorView.value.dispatch;
  return setBlockType(mySchema.nodes.paragraph)(state, dispatch);
}
```

效果：

## ![在这里插入图片描述](..\post-assets\9214ea13-983f-48b5-9a67-845f52a9d7f5.png)

基本功能完成，后续就是完善、添加 commands 了。不演示了