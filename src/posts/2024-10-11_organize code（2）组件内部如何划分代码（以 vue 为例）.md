---
id: de3a4b40-06c5-4aac-9dd3-7e9c68902043
title: organize code（2）组件内部如何划分代码（以 vue 为例）
createTime: 2024-10-11
updateTime:
categories: vue
tags: 方法论
series: organize code
description:
---

## 解释：为什么组件内部还要划分代码？

### 组件是“视图组件”，一个组件包含多种逻辑功能

虽然说“组件是按照功能划分的”，但用“功能”二字其实模糊了组件的含义。说得直白点，组件是按照“UI 设计图中的这一块、那一块”划分的。所以组件其实是视图组件。

那么一个视图组件，内部按照逻辑区分，会存在多种逻辑功能。所以需要研究如何划分这些逻辑功能，即如何拆分 script

### 提取出公共方法可以吗？

一个自然而然地想法是，“我只要将 script 按照逻辑功能划分成一个个 utils/helpers 就可以了吧？” —— 答案是 NO！

因为每一块逻辑功能不止包含方法，还会包含响应式数据（data computed watch)、生命周期钩子（created mounted）等，这些是 utils/helpers 无法包含的。

## mixin

<!-- 随着项目复杂化，有时组件化无法满足需求。举例：

1. 需要复用某个功能，但它是纯逻辑，没有视图，并不适合作为一个组件。比如：获取鼠标位置、通用的校验逻辑
2. 组件需求越来越复杂，想要拆分成多个子功能。但是并不想拆成多个组件，只想拆 script 的部分。

总结来说，就是想把组件的逻辑部分（即 script）进一步拆分。而且这部分不止包含方法，还包含数据、watch、lifecycle hook 等（如果只包含方法，那么就拆成 helpers/utils 就可以解决问题了）。

-->

vue 提供 [mixin](https://v2.cn.vuejs.org/v2/guide/mixins.html) 功能：允许你将 vue 的**所有选项**都提取出来。

```js
const formDataMixin = {
  data() {
    return { formData: { name: "" } };
  },
};
const formValidateMixin = {
  watch: {
    "formData.name"(val) {
      // check name
    },
  },
};
```

```html
<div id="app">
  <input type="text" v-model="formData.name" />
</div>
<script>
  var app = new Vue({
    el: "#app",
    mixins: [formDataMixin, formValidateMixin],
  });
</script>
```

mixin 能解决拆分 script 的问题，但是很难维护。当你有多个 mixin 且存在依赖关系时，很难知道数据从哪来、到哪去。所以我强烈建议不要用 mixin。

补充一下，出于同样的原因，我也反对滥用 provide/inject：

- 作为 provider，你很难知道谁在用你提供的数据
- 作为接收数据的人，你很难找到谁是 provider

## composition-api

vue 后续推出了 composition-api，提供了拆分 script 的完美解决方案：

- 组件中 script 的内容不再按照“类型”划分，可以自己按逻辑组合了（见 [vue 文档中的一个示例](https://cn.vuejs.org/guide/extras/composition-api-faq#more-flexible-code-organization)，很直观地展示出组合式的压倒性优势）
- 提供响应式 API（`ref` `watch`），可以直接创建响应式数据、计算属性、watcher。
- 提供 lifecycle hook(`onMounted`)

```js
import { reactive } from "vue";
function useFormData() {
  const formData = reactive({
    name: "",
  });
  return formData;
}
```

```js
import { watch } from "vue";
function useFormValidate(formData) {
  watch(
    () => formData.name,
    (val) => {
      console.log(val);
    }
  );
}
```

```html
<script>
  export default {
    setup() {
      const formData = useFormData();
      useFormValidate(formData);
      return { formData };
    },
  };
</script>

<template>
  <input v-model="formData.name" type="text" />
</template>
```

## 总结

因为组件是按照**视图**划分的，而不是按照**逻辑**划分的。所以一个组件内部可能有多个逻辑，所以要研究如何拆分 script。

vue 的拆分 script 的方案，从 **mixin** 进化为 **composition-api**，实质上是 vue 组件从 **选项式** 到 **组合式** 的进化：

- 选项式：按**类型**划分代码（data、watch、created 等）
- 组合式：按**功能**划分代码

回看[上一篇文章](post:f351e19e-b84b-4da0-bf3d-052f26a1626a) 页面划分代码也经历了从 **传统开发** 到 **模块化/组件化** 的过程：

- 传统开发：按**类型**划分代码（html、css、js）
- 模块化/组件化：按**功能**划分代码（Header、Main、Footer）

这两篇文章的研究主题：页面拆成多个组件，组件内 script 拆成多个 composable，都是研究如何“细化”、如何拆分，都经历了从 按**类型**划分 -> 按**功能**划分的过程。这个思路可以扩展到更多层面，比如说在某个 composable 里，我之前的常规写法是按照类型组合：

```js
function useTest() {
  const a = ref("");
  const b = ref("");

  watch(a);
  watch(b);

  function a_somthing() {}
  function b_something() {}
}
```

是不是也可以考虑按功能组合呢？比如：

```js
function useTest() {
  const a = ref("");
  watch(a);
  function a_somthing() {}

  const b = ref("");
  watch(b);
  function b_something() {}
}
```

这样虽然从代码语法的角度没有分别，但是也许可读性会变高，而且如果以后需要进一步拆分或者重构也方便。（我是在写文章梳理思路的过程中发现了这一点，真有趣~这就是写博客日志的意义之一吧，梳理的过程也是学习的过程！）

## 下一篇文章

普通项目中，了解前篇和本篇的内容就足够了。遵循一下原则：

- 单一文件不要承担过多功能，按照功能逐渐拆分、细化
- 遵守目录规范（一层套一层，让有关的内容就近放置）。

但是我当下在开发的项目不是普通项目，它规模大，且需求不断迭代。在这个项目中，如果教条地遵守上述原则，会遇到一些新麻烦，关于文件如何组织（即各个组件文件应该放在哪里）
