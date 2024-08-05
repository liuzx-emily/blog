---
id: 3e0b14e7-fd36-4729-a02a-3460425d880c
title: vue-dist 的代码中为什么会出现 process.env.NODE_ENV
createTime: 2023-03-13
updateTime: 2024-08-05
categories: build tools
tags:
description:
---

## 疑问

日常开发中我们使用的 vue 不是源码，而是 build 后的代码。但是这个 build 后的代码里出现了 `process.env.NODE_ENV`。[vue/dist/vue.runtime.esm-bundler.js](https://unpkg.com/browse/vue@3.2.47/dist/vue.runtime.esm-bundler.js)：

```js
if (process.env.NODE_ENV !== "production") {
  initDev();
}
```

这是为什么？它不是应该在 build 阶段就被替换掉了吗？

## 解释

以 esm 格式为例。vue build 时，esm 格式会导出两种资源：

- `vue.esm-browser.js` 浏览器通过 `<script type="module">` 引用
- `vue.esm-bundler.js` 给 rollup、webpack 等打包工具使用

在 vue 源码中有这样的内容：

```js
if (__DEV__) {
  initDev();
}
```

vue 打包配置 [vue/rollup.config.js](https://github.com/vuejs/core/blob/main/rollup.config.js)：

```js
import replace from '@rollup/plugin-replace'
  const isProductionBuild =
    process.env.__DEV__ === 'false' || /\.prod\.js$/.test(output.file)

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

打包时判断输出格式（format）是不是 bundler 格式（isBundlerESMBuild）：

###### 不是 isBundlerESMBuild

`__DEV__` 被替换为 `!isProductionBuild`（是一个 Boolean 值）

- vue.esm-browser.js。浏览器，开发环境中用。`__DEV__` 的值是 true。打包后代码：

```js
{
  initDev();
}
```

- vue.esm-browser.prod.js。浏览器，生产环境中用。`__DEV__` 的值是 false，从而被 tree-shaking 移除。打包后代码：

```js

```

###### 是 isBundlerESMBuild

bundler 格式，给打包工具用。`__DEV__` 被替换为字符串 `(process.env.NODE_ENV !== 'production')`。

- vue.esm-bundler.js

```js
if (process.env.NODE_ENV !== "production") {
  initDev();
}
```

这样替换的好处是 vue 只需要输出一份文件。因为我们的项目最终还会经过打包工具的 build，即 vue 的这份已经 build 过的文件（vue.esm-bundler.js）还会通过二次 build。在第二次 build 它的过程中，根据打包工具的配置项决定最终构建的目标环境（对比上面的浏览器环境中，因为不会再次 build vue.esm-browser.js，没有二次处理机会，所以 vue 打包时只能输出两份文件）
