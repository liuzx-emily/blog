---
项目使用npm，以后考虑升级为pnpm。
注意 github action 中也要改
---

https://houdini.how/resources/

---

## Proxy 详细文档

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

---

## 开发经验总结

css：

- popper 放在 body 下面。好处是：
  - 不会影响“逻辑”父元素的 overflow、background-attachment：local
  - 好处理 z-index；

注意 vue2 和 vue3 的差异。

---

## eslilnt

eslint 支持 jsx

发现一个好用的 [eslint 插件](https://www.npmjs.com/package/eslint-plugin-import)，可以直接提示 unable to resolve path。

研究 eslint 配置的时候，发现了一个好用的工具 [inspect eslint config](https://eslint.org/blog/2024/04/eslint-config-inspector/)

---

https://antfu.me/posts/why-not-prettier-zh
