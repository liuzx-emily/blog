---
id: aea0792d-441d-4608-bffc-02ea956418d8
title: 迁移代码时发现 Super Uploader 中文件状态不更新
createTime: 2024-09-18
updateTime:
categories: vue
tags: vue2, vue3
description: 当初写 SuperUploader 时是在 vue2 环境下，此次迁移是 vue3 环境。直接修改原对象属性在 vue2 中可以触发响应，vue3 中无法触发。
---

## bug 描述

在迁移代码（将之前写的多个项目统一放在 playground 项目中）的过程中发现 [SuperUploader 组件](https://liuzx-emily.github.io/playground/#/super-uploader)出现 bug：上传的文件展示在页面中后，状态一直是“初始化”。

研究了一番，发现果然是 vue2 和 vue3 的差异导致的。我当初写 SuperUploader 时是在 vue2 环境下的，此次迁移是 vue3 环境。同样的代码在 vue2 中正常运行，但是在 vue3 中就会出问题。

代码简化如下：

```html
<script setup>
  import { ref } from "vue";

  const list = ref([]);

  function addTask() {
    const task = { id: 1, state: "初始化" };
    list.value.push(task);
    computeTask(task);
  }

  function computeTask(task) {
    setTimeout(() => {
      task.state = "已完成";
    }, 1000);
  }
</script>

<template>
  <section>
    <input type="button" value="添加任务" @click="addTask" />
    {{ list }}
  </section>
</template>
```

页面中展示文件列表 list，初始为空。点击“添加任务”后新增一条任务，状态为“初始化”，并且立刻运行 computeTask。1s 后计算完毕，任务状态变为“已完成”。

在 vue2 中确实是上述效果。但是在 vue3 中任务状态一直是“初始化”。

## 分析

### 响应式原理

vue2 和 vue3 中实现响应式的原理不同。简单理解：

- vue2 中使用 Object.defineProperty 递归地给 obj 的所有属性设置 getter 和 setter，然后返回 obj。
- vue3 中创建一个 Proxy 对象代理 obj，然后返回 Proxy 对象。

所以 `const reactiveObj = reactive(obj)`：

- vue2 中创建响应式就是直接操作原对象，最后返回的也是原对象。所以可以直接操作原对象触发响应
- vue3 中 reactiveObj 是一个新建的 Proxy 对象。要实时响应变化必须修改 Proxy 对象，不能直接修改原对象。

### 测试

将上面的代码稍微修改一下：修改 addTask，deep watch list：

```js
import { nextTick, ref, watch } from "vue";
const list = ref([]);
function addTask() {
  const task = { id: 1, state: "1" };
  list.value.push(task);
  task.state = "2";
  nextTick(() => {
    task.state = "3";
  });
  setTimeout(() => {
    task.state = "4";
  }, 0);
}
watch(
  list,
  (val) => {
    console.log("list changed:", val[0].state);
  },
  { deep: true }
);
```

在 vue2 和 vue3 环境中测试效果：点击按钮，查看页面显示内容和控制台输出内容。

- vue2：页面显示 `[{"id": 1, "state": "4"}]`，控制台输出：
  ```bash
  list changed: 2
  list changed: 3
  list changed: 4
  ```
- vue3：页面显示 `[{"id": 1, "state": "2"}]`，控制台输出：
  ```bash
  list changed: 2
  ```

vue2 的效果如预期。但 vue3 的效果有些意外 —— 本以为 vue3 中控制台和页面都会显示 state 是 1。

###### vue 不是数据变化立刻响应，所以“蹭”到了

这种意外效果是因为 vue **不是数据一变化就立刻响应的**，那样太浪费性能了，而且大部分情况下没有必要。

比如下面的代码：连续修改 name 的值，但是只触发一次 watch：

```js
import { reactive, watch } from "vue";

const data = reactive({ name: "" });
watch(data, (val) => {
  console.log("data changed", val);
});
data.name = "foo";
data.name = "bar";
data.name = "baz";
```

现在回看 vue3 中的效果：

```js
function addTask() {
  const task = { id: 1, state: "1" };
  list.value.push(task);
  task.state = "2";
  // ...
}
```

vue3 中点击按钮后，控制台输出、页面变化都是由 `list.value.push(task)` 触发的。但是触发的回调不会立刻执行，而是等待所有同步代码完成后再执行。
接着运行 `task.state="2"`，这一步修改了数据。此时所有同步代码都执行完毕了，触发所有回调。

所以可以说 vue3 的意外效果是因为 `task.state="2"` **蹭**了 `list.value.push(task)` 的回调。

###### watch 改为立刻响应，查看效果

watch 的更新策略可以修改，设置为 sync 查看效果（vue 页面渲染的更新策略无法修改）

```js
watch(
  list,
  (val) => {
    console.log("list changed:", val[0].state);
  },
  // 设置为 sync，数据一变立刻执行
  { deep: true, flush: "sync" }
);
```

其他代码都不变。测试 vue2 和 vue3 中的效果：

- vue2：页面显示不变，还是 `[{"id": 1, "state": "4"}]`。控制台输出：
  ```bash
  list changed: 1 # 比之前多了这行
  list changed: 2
  list changed: 3
  list changed: 4
  ```
- vue3：页面显示不变，还是 `[{"id": 1, "state": "2"}]`。控制台输出：
  ```bash
  list changed: 1   # 之前是2，现在是1
  ```

## 总结

vue2 和 vue3 中实现响应式的原理不同：

- vue2 中使用 Object.defineProperty 递归地给 obj 的所有属性设置 getter 和 setter，然后返回 obj。
- vue3 中创建一个 Proxy 对象代理 obj，然后返回 Proxy 对象。

所以 `const reactiveObj = reactive(obj)`：

- vue2 中创建响应式就是直接操作原对象，最后返回的也是原对象。所以可以直接操作原对象触发响应
- vue3 中 reactiveObj 是一个新建的 Proxy 对象。要实时响应变化必须修改 Proxy 对象，不能直接修改原对象。

在 vue3 中 `task.state = '2'` 看上去能响应是因为"蹭"到了上一行 push，它本身不能触发响应。

```js
const task = { id: 1, state: "1" };
list.value.push(task);
task.state = "2"; // 蹭了上一行 push
```

---

更多内容见[《vue2 和 vue3 的区别》](post:a99753cb-e433-4b58-a4d1-4b46fab167b5)
