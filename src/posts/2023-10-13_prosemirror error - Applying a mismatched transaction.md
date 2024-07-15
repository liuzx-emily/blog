---
id: ef915aca-7b73-4057-b42f-5c1bcfb81838
title: prosemirror error - Applying a mismatched transaction
createTime: 2023-10-13
updateTime: 2023-10-13
categories: vue, prosemirror
tags:
description: vue3 project，prosemirror 报错：Uncaught RangeError
---

## bug 描述

使用 prosemirror 时，dispatch transcation 报错：
![在这里插入图片描述](..\post-assets\925aa35f-9b80-4dc4-83ce-ccd931631557.png)
代码如下（简化版）：

```js
import { inject } from "vue";
const editorView = inject("editorView");

function handleClick() {
  const view = editorView.value;
  view.dispatch(view.state.tr.deleteSelection());
}
```

在 prosemirror discuss 找到了相关问题：[RangeError: Applying a mismatched transaction](https://discuss.prosemirror.net/t/rangeerror-applying-a-mismatched-transaction/1846)。pm 的作者在讨论中解释了这个 error 的含义：

> “Mismatched transaction” errors mean that something is trying to dispatch a transaction that doesn’t start from the view’s current state—I.e. if you create the transaction but then don’t synchronously dispatch it, it’d be possible for another transaction to happen in the meantime, which makes your transaction invalid. The rest of the stack trace for the error likely points at the code that’s dispatching the transaction on the outdated (or, possibly, completely unrelated) state.

很奇怪，我没有用异步操作啊。顺着报错 stack，找到 applyInner 方法。发现当 eq() 返回 false 时，会抛出 error

![在这里插入图片描述](..\post-assets\59a69758-2238-49f6-893a-3a1a4d9a962e.png)
查看 eq 方法，根据注释知道它是用来判断 `this` 和 `other` 是否代表同一块内容。
![在这里插入图片描述](..\post-assets\e2f8f85b-6779-4f26-bf61-9739f29f5d38.png)
查看 this，是 Vue 的 Reactive 对象，包着 doc Node。
![在这里插入图片描述](..\post-assets\77d41771-40db-4559-855d-e2b8583617ac.png)

查看 other：是 doc Node 对象
![在这里插入图片描述](..\post-assets\bdecc582-1c70-4769-8724-9f7da11b8aa9.png)

破案了。

## 解释

我项目用的 vue3。在父组件中把 editorView 用 ref 包了一下，然后 provide 下去。

```js
const editorView = ref();
provide("editorView", editorView);
onMounted(() => {
  editorView.value = new EditorView();
});
```

子组件（也就是调用 dispatch 的组件） inject 进来的是这个 ref 对象。
==在 vue 3 中被 ref 包着的对象，通过`.value` 得到的不是原对象，而是原对象的 proxy！==

解决方法：在 vue3 项目中不要用 ref 了，用 `shallowRef`

```js
const editorView = shallowRef();
```

## 测试 vue2 和 vue3

```js
const obj = { a: 1 };
console.log(obj === ref(obj).value);
```

同样一段代码，在 vue2 环境中是 `true`，在 vue3 中是 `false`
平时工作项目里一直用 vue2，这次测试项目装的 vue3，没注意差别
==一定要记得，vue2 和 vue3 的响应式原理是有区别的。平时开发不显眼，一旦踩坑就很麻烦==
