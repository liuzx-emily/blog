---
id: de5ecfba-2bac-44e2-99d9-3cb40b702f5e
title: vue 中 computed 、created 、mounted 的先后顺序
createTime: 2021-07-07
updateTime:
categories: vue
tags:
description:
---

## 先看实例

```html
<template>
  <section>
    {{ c }} {{ c }}
    <input type="button" value="点我，我用到了b" @click="handleClick" />
  </section>
</template>

<script>
  export default {
    computed: {
      b() {
        console.log("computed b");
        return this.a;
      },
      c() {
        console.log("computed c");
        return this.a;
      },
    },
    data() {
      return {
        a: 1,
      };
    },
    created() {
      console.log("created");
    },
    mounted() {
      console.log("mounted");
    },
    methods: {
      handleClick() {
        console.log(this.b);
      },
    },
  };
</script>
```

- 页面加载时，触发的顺序是：`created` => `computed c` => `mounted`
- 点击按钮时：第一次点击触发 `computed b`，之后的点击不触发

## 原因

初始化计算属性的时候，对每一个计算属性：

- 建立 watcher，设为 lazy
- 设置 computedGetter（每次读取值的时候，调用 wathcer.evaluate() ，如果是 dirty 的就现算）

具体见 [《vue2 源码学习（三）渲染函数的观察者》](post:3e93ed72-b6cd-45ca-8f0d-53b2f9c1b761) 中 **计算属性的实现**

回过头分析上面的例子：

- 页面加载时：初始化数据 -> `created` -> 渲染模板期间，template 用到了 c，第一次用到 C 的时候会触发一次 `computed c` 来求值，第二次用到 c 时不会重复求值 -> 渲染完成 `mounted`

- 点击按钮时：用到了 b，第一次点击的时候，b 还没有值，触发一次 `computed b` 来求值；之后点击，此时 b 已经有值了，不会重复求值

## 练习

```html
<template>
  <section>
    {{ c }}
    <input type="button" value="用到b" @click="() => b" />
    <input type="button" value="修改a" @click="a += 1" />
  </section>
</template>

<script>
  export default {
    computed: {
      b() {
        console.log("computed b");
        return this.a;
      },
      c() {
        console.log("computed c");
        return this.a;
      },
    },
    data() {
      return {
        a: 1,
      };
    },
    created() {
      console.log("created");
    },
    mounted() {
      console.log("mounted");
    },
  };
</script>
```
