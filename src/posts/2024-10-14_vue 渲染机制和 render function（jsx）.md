---
id: 475485d8-3f09-4cd0-a3cc-b94b1a7ed67e
title: vue 渲染机制和 render function（jsx）
createTime: 2024-10-14
updateTime:
categories: vue
tags:
description: 介绍 vue 渲染机制（虚拟 DOM，编辑/挂载/更新），介绍 render function 和 jsx 的优势和用法。
---

## vue 渲染机制

详细介绍见 [vue 文档 - 渲染机制](https://cn.vuejs.org/guide/extras/rendering-mechanism.html)

### 虚拟 DOM

虚拟 DOM：用 js 对象描述 HTML 结构，将真实的 DOM 与之保持同步。

```js
const vnode = {
  type: "div",
  props: { id: "hello" },
  children: [
    /* 更多 vnode */
  ],
};
```

### 渲染机制

挂载 vue 组件时会发生的事：

- 编译：将 template 模板被编译为 render function（即用来返回虚拟 DOM 树的函数）。这一步骤可以通过构建步骤提前完成，也可以通过使用运行时编译器即时完成。

- 挂载：运行时渲染器调用 render function，遍历生成虚拟 DOM 树，并基于它创建实际的 DOM 节点。这一步会作为响应式副作用执行，因此它会追踪其中所用到的所有响应式依赖。

- 更新：当依赖发生变化后，副作用（即 render function）会重新运行，这时候会创建一个更新后的虚拟 DOM 树。运行时渲染器遍历这棵新树，将它与旧树进行比较，然后将必要的更新应用到真实 DOM 上去。

### template 的优势

实际项目中，使用 template 能满足大部分需求。但是在处理高度动态渲染逻辑时，可以直接手写渲染函数，更加灵活。

但是 vue 还是默认推荐相对不那么灵活的 template 写法，除了因为它很像 html，可读性高。还因为 template 写法更容易做静态分析，使得 Vue 的模板编译器能够应用许多编译时优化来提升虚拟 DOM 的性能表现（见[vue 文档](https://cn.vuejs.org/guide/extras/rendering-mechanism.html#compiler-informed-virtual-dom)）。

## render function

vue 提供 `h()` 函数，用于创建 vnodes。

选项式 API ：使用 render 选项

```js
import { h } from "vue";
export default {
  render() {
    return h("p", {}, "选项式 API 中使用 render");
  },
};
```

组合式 API 中：在 setup 中返回一个函数作为渲染函数。

```js
import { h } from "vue";
export default {
  setup() {
    return function () {
      return h("p", {}, "组合式 API 中在 setup 中返回渲染函数");
    };
  },
};
```

### multiple components in one SFC

使用 render function，可以在一个 SFC 中创建多个 components。其中 `export default` 的是主组件，视图用 template 或者 render function 都可以。子组件数量不限，视图用 render function。

### composable with view

使用 render function，还可以让原本纯负责逻辑的 composable 提供视图功能了。

调用 composable 时，它提供的视图可用可不用。composable 也可以提供多个视图片段，使用的时候自由组合：

```js
function useTest() {
  const someData = ref("some data");
  return {
    someData,
    FooRender: () => <div>foo</div>,
    BarRender: () => <div>bar</div>,
  };
}
```

页面 A 是左右结构：

```jsx
setup(props) {
  const { someData, FooRender, BarRender } = useTest();
  return function () {
    return (
      <div>
        <div class="left">
          <div class="left-main">{FooRender()}</div>
        </div>
        <div class="right">{BarRender()}</div>
      </div>
    );
  };
}
```

页面 B 是上下结构：

```jsx
setup(props) {
  const { someData, FooRender, BarRender } = useTest();
  return function () {
    return (
      <div>
        <div class="top">{FooRender()}</div>
        <div class="main">略</div>
        <div class="bottom">{BarRender()}</div>
      </div>
    );
  };
}
```

composable with view 和 components 的功能非常类似。我只是发现了还有这种写法，所以在此记录。但我不确定有没有什么场景下它比 components 更好用（我暂时没想出来）

###### `<script setup>` 中无法使用渲染函数

单文件组件的 `<script setup>` 中无法使用渲染函数。

一般情况下用 `<script setup>` 是为了省略注册 components 和 setup 中返回数据。

```js
import comp1 from "./comp1";
import comp2 from "./comp2";

export default {
  components: { comp1, comp2 /* 注册很多子组件，给 template 用 */ },
  setup() {
    var message;
    function clickHandler() {}
    return {
      message,
      clickHandler /* 返回一大串响应式数据、方法，给 template 用*/,
    };
  },
};
```

用 `<script setup>` 可以省去 components 和 setup 的返回值：

```html
<script setup>
  import comp1 from "./comp1";
  import comp2 from "./comp2";
  var message;
  function clickHandler() {}
</script>
```

但是用 render function 的时候，本来就不需要注册 components 和 setup 返回值。所以用 `<script setup>` 没有什么优势了。

```js
import { h } from "vue";
import HelloWorld from "./HelloWorld.vue";
export default {
  setup() {
    return function () {
      // 组件 HelloWorld 不需要注册，直接在渲染函数中使用。
      return h("p", {}, ["组合式 API 中在 setup 中返回渲染函数", h(HelloWorld)]);
    };
  },
};
```

所以 vue 认为给 `<script setup>` 添加 `definRender()` 这样的 API [可以，但并不必要](https://github.com/vuejs/core/issues/4980#issuecomment-1123419660)。所以没有在 vue 中加这个功能，而是加到了 [vue macros](https://vue-macros.dev/macros/define-render.html) 中（相关讨论见[[Core Team RFC] New SFC macro: defineRender](https://github.com/vuejs/rfcs/discussions/585)）

### jsx

render function 的 `h` 灵活性高，但如果你还是喜欢类 html 的写法，可以在 render function 中用 jsx。

render function 中 h 和 jsx 可以混着写：一般情况用 jsx，jsx 无法处理时用 `h`。

```jsx
setup(props) {
  return function () {
    return (
      <div>
        <ul>
          <li>foo</li>
          <li>bar</li>
        </ul>
        {h("h" + props.type, {}, ["标题" + props.type])}
      </div>
    );
  };
}
```

想在项目中使用 jsx 语法需要配置。以 vite+vue2 项目为例：

- [@vitejs/plugin-vue2-jsx](https://github.com/vitejs/vite-plugin-vue2-jsx)
- [eslint-plugin-vue](https://eslint.vuejs.org/user-guide/)

```js
export default [
  {
    files: [
      "**/*.{js,mjs,cjs,vue}",
      "**/*.jsx", // 添加针对 .jsx 文件（如果你不仅在 .vue 中使用 jsx 语法，还在项目中直接使用了 jsx 文件）
    ],
  },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // 开启 jsx 语法（无论是在 .vue 中，还是 .jsx 中）
        },
      },
    },
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/vue2-strongly-recommended"],
];
```

`eslint-plugin-vue` 会把 .vue 和 .jsx 中 `default export` 的视为 vue components。如果是在其他情况下创建的 vue 组件（比如说 .vue 文件中的 child components），eslint 不知道这是 vue 组件，所以不会对其应用 vue component 的 rules。这种情况可以用 `defineComponent()` 或者 `//@vue/component` 声明这是 vue 组件（具体见[文档](https://eslint.vuejs.org/user-guide/#how-does-eslint-detect-components)）。

- 【可选】[vue-macro](https://vue-macros.dev/features/jsx-directive.html) 支持在 jsx 中使用 vue 指令（`v-if` `v-for`等）

### 组件写在 .vue 中和 .js(x) 中的区别

组件使用 render function 时，组件写在 `.vue` 中还是写在 `.js(x)` 中只在 css 方面有区别：单文件组件让你可以把 css 直接写在同一个文件中，且很方便地支持 scoped css、css 预处理器（less scss）。

所以如果组件有 css 需求，建议用单文件组件。如果没有 css 需求，那么写在哪都可以。
