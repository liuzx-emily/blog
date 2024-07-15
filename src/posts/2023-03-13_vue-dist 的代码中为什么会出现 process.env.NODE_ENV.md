---
id: 3e0b14e7-fd36-4729-a02a-3460425d880c
title: vue-dist 的代码中为什么会出现 process.env.NODE_ENV
createTime: 2023-03-13
updateTime: 2023-03-13
categories: 底层工具
tags: rollup, webpack
description: 日常开发中，我们使用的 vue 代码是 build 后的。但是这个 build 后的代码里出现了  process.env.NODE_ENV，这是为什么？它为什么没有在 build 阶段被替换掉？
---

## 疑问

日常开发中，我们使用的 vue 代码不是源码，而是 build 后的。但是这个 build 后的代码里出现了 `process.env.NODE_ENV`，这是为什么？它不是应该在 build 阶段就被替换掉了吗？

[vue/dist/vue.runtime.esm-bundler.js](https://unpkg.com/browse/vue@3.2.47/dist/vue.runtime.esm-bundler.js) 中：

```js
...
if ((process.env.NODE_ENV !== 'production')) {
    initDev();
}
...
```

---

## 解释

vue build 时，同是 esm 格式，会导出两种资源：

- vue.esm-browser.js
- vue.esm-bundler.js

rollup、webpack 等打包工具在寻找资源时，会优先使用 package.json 中的 module 字段。

查看 vue 源码中的 /packages/vue/package.json 文件：

```json
{
  "module": "dist/vue.runtime.esm-bundler.js"
}
```

所以，**-bundler** 是给 rollup 或 webpack 等打包工具使用的，**-browser** 是直接给浏览器 `<script type="module">` 使用的。它们的区别如下：

在 vue 源码中有这样的内容：

```js
if (__DEV__) {
  initDev();
}
```

在 build 时，`__DEV__` 的值会被替换

- esm-browser.js
  浏览器，开发环境中用。`__DEV__` 的值是 true
  ```js
  {
    initDev();
  }
  ```
- esm-browser.prod.js
  浏览器，生产环境中用。`__DEV__` 的值是 false，从而被 tree-shaking 移除

  ```js

  ```

- esm-bundler.js
  rollup 或 webpack 等打包工具中使用。`__DEV__` 不再简单设置为 true 或 false，而是使用 `(process.env.NODE_ENV !== 'production')` 替换
  ```js
  if (process.env.NODE_ENV !== "production") {
    initDev();
  }
  ```
  这样做的好处是，用户可以通过打包工具的配置项自行决定构建资源的目标环境。

---

vue/rollup.config.js：

```js
import replace from '@rollup/plugin-replace'

function createConfig(format, output, plugins){
	const isBundlerESMBuild = /esm-bundler/.test(format)

	function resolveDefine(){
	    if (!isBundlerESMBuild) {
	      // hard coded dev/prod builds
	      replacements.__DEV__ = String(!isProductionBuild)
	    }
	    return replacements
	}

	function resolveReplace(){
	    if (isBundlerESMBuild) {
	      Object.assign(replacements, {
	        // preserve to be handled by bundlers
	        __DEV__: `process.env.NODE_ENV !== 'production'`
	      })
	    }
	    return [replace({ values: replacements, preventAssignment: true })]
	}

	return {
	    plugins: [
	      ...resolveReplace(),
	      esbuild({
	        ...
	        define: resolveDefine()
	      }),
	    ],
  }
}


```
