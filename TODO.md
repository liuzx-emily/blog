https://developer.mozilla.org/zh-CN/docs/Web/CSS/::first-line

---

npm 系列

- scope
  https://docs.npmjs.com/about-scopes
  https://docs.npmjs.com/package-scope-access-level-and-visibility
- [npm pack](https://docs.npmjs.com/cli/v10/commands/npm-pack)

一些好玩的 npm 命令，可以放在一篇文章里

- [npm ci](https://docs.npmjs.com/cli/v10/commands/npm-ci/)
- [npm doctor](https://docs.npmjs.com/cli/v10/commands/npm-doctor)
- [npm explain](https://docs.npmjs.com/cli/v10/commands/npm-explain)
- [npm ls](https://docs.npmjs.com/cli/v10/commands/npm-ls)
- [npm outdated](https://docs.npmjs.com/cli/v10/commands/npm-outdated),npm update
- [npm pkg](https://docs.npmjs.com/cli/v10/commands/npm-pkg)
- [npm prune](https://docs.npmjs.com/cli/v10/commands/npm-prune)

[npm workspace](https://docs.npmjs.com/cli/v10/using-npm/workspaces)

---

csdn 中的草稿搬过来

---

super-dev 中检查文章分类是否有效。
但是如果在运行期间 categories.js 变化了，脚本中 import 的 categories 数据还是原先那份，所以检验失效了。

每次现 readFile 应该可行。动态 import 不知道行不行？

---

研究如何让 pre[collapsed]

---

asset 内容如果有中文，在网站上看会乱码。

装了一个修改 http 请求头响应头的插件，一通测试发现给 response header 设置 content-type ：text/plain; charset=utf-8 就可以了。
（之前没有 content-type）

不知道为什么 需要继续研究

---

跳转到文章时自动滚动至指定标题的功能失效。

```js
window.addEventListener("scroll", function () {
  debugger;
  console.log("scroll");
});
```

发现页面加载后触发了两次 scroll：

- 第一次 scroll 是我触发的“自动滚动至指定标题”
- 第二次 scroll 不知道是怎么处罚的，call stack 中没有显示。

---

vue 选项式 -> 组合式

以前选项式，拆分功能不好拆，只能用 mixin。
组合式可以随意拆分，可复用+逻辑清晰。

复杂的功能，在单文件组件中已经把 js 逻辑拆分成一个个 use 了，但是 html 还堆在一起，很长很恶心，有时候纯为了减少 template 行数而拆分两个组件 —— 因为单文件组件中只能有一个 `<template>`

—— 但其实并非如此。可以在单文件组件中通过 js 创建多个 component。

render 方法中 h 和 jsx 语法可以混着写。

[@vitejs/plugin-vue2-jsx](https://github.com/vitejs/vite-plugin-vue2-jsx)
https://cn.vuejs.org/guide/extras/render-function.html
注意：vue2 和 3 里用法可能有不同

如果还想要 scoped css，那么还用 .vue。

```html
<script lang="tsx">
  const word = "JSX & SFC works!";

  export default {
    render() {
      return <div class={"jsx-sfc"}> {word} </div>;
    },
  };
</script>
```

如果不需要 scoped scss 了，可以直接用 jsx

```jsx
import { ref, defineComponent, h } from "vue";
const Foo = defineComponent({
  render() {
    return <p>Foo</p>;
  },
});
const Bar = defineComponent({
  render() {
    return <p>Bar</p>;
  },
});
export default defineComponent({
  props: {
    start: Number,
    isReverse: { type: Boolean, default: false },
    isHeading: { type: Boolean, default: false },
  },
  setup(props) {
    console.log(props);
    const number = ref(props.start);
    const label = "+";
    function increment() {
      number.value += 1;
    }

    const FirstEl = props.isReverse ? Foo : Bar;
    const SecondEl = props.isReverse ? Bar : Foo;
    function render() {
      return h(props.isHeading ? "h1" : "div", [
        <div class={"jsx"}>
          <p>
            {number.value}
            <el-button type="primary" size="small" onClick={increment}>
              {label}
            </el-button>
            <FirstEl />
            <SecondEl />
          </p>
        </div>,
      ]);
    }
    return render;
  },
});
```

研究了一下在 jsx 中使用 scoped scss 的方法，没找到好方案：

- css module 只支持 classname（不支持其它如 tagName id）
- 虽然可以用 scss module，但是不支持 nested 写法。而且会导出其它 scss 文件中的 class，非常奇怪

---

- a
  ```js
  const a = 1;
  ```

showdown.js 没法转换

---

Proxy 详细文档：

- [mdn web docs - Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [exploringjs - Proxy](https://exploringjs.com/es6/ch_proxies.html)

## js 中无法判断一个对象是不是 Proxy

> Proxies are shielded in two ways:
>
> - It is impossible to determine whether an object is a proxy or not (transparent virtualization).
> - You can’t access a handler via its proxy (handler encapsulation).

nodejs 中可以用 [util.types.isProxy](https://nodejs.org/api/util.html#utiltypesisproxyvalue) 判断。

---

https://exploringjs.com/

js pdf 文档，下载的，网盘预览的

---

开发经验总结：

css：

- popper 放在 body 下面。好处是：
  - 不会影响“逻辑”父元素的 overflow、background-attachment：local
  - 好处理 z-index；

注意 vue2 和 vue3 的差异。
