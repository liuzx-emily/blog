---
id: 33e4afe0-53b7-4c5e-964d-08a8b63e070d
title: element-ui 吐槽合集
createTime: 2024-08-07
updateTime:
categories: element-ui
tags:
description: tabs 没有 tab-change 事件；dialog 的 destroy-on-close 是假的；dialog 套 tabs 会卡死
---

记录我和 element-ui 的虐恋情深。如果有的选，请用 antdv。

## Tabs 没有 tab-change 事件

```html
<el-tabs v-model="activeName" @tab-click="handleTabClick">
  <el-tab-pane label="panel1" name="1">panel1内容</el-tab-pane>
  <el-tab-pane label="panel2" name="2">panel2内容</el-tab-pane>
</el-tabs>
```

我需要监听用户手动切换 tab：

- 不能用 `watch(activeName)`：因为项目中其它地方会通过 js 修改 activeName，这也会被 watch 逮住，但是我只想监听用户手动切换 tab。
- 不能用 `@tab-click`：因为用户只要点击 tab 就会触发，无论是否 change。

只能自己写一个 `tab-change`，但是很恶心！

切换 tab 时点击的是每个 tab 的 header 部分，这部分的 dom 结构是 el-tabs 内部生成的，所以无法给 tab header 绑定 native 事件。

想要监听 tab-header 的 click 事件只能用 el-tabs 提供的 `@tab-click`，这个事件的回调参数只有一个，即当前点击的 tab。但是触发 tabClick 时，activeName 已经变化了，所以无法通过对比判断是否 change 了。

```js
// 假设你原本在 panel1，现在点击 panel2
function handleTabClick(tab) {
  console.log(tab.name); // '2'
  console.log(activeName.value); // '2'。activeName 已经变化了
  console.log(activeName.value === tab.name); // 恒为 true。所以无法判断是否 change 了。
}
```

解决方法当然有，比如用一个变量单独存放上一次的 activeName 用来对比，要说逻辑其实不复杂，但是太恶心了！我的建议是别用 el-tabs。

## Dialog 的 destroy-on-close 是假的

el-dialog 提供 `destroy-on-close` 属性：关闭时销毁 Dialog 中的元素。但是它的实际效果并非如此，而是**在关闭时重新渲染 Dialog 中的元素**。

我真的服气了，我以为“如何在代码里埋坑？——在注释中撒谎”只是段子，没想到遇到真的了，在属性名和文档里说瞎话。。。。

想要真正的 destroy-on-close 效果，还是用 `v-if`

## Dialog 套 Tabs 会卡死

```html
<el-dialog :visible.sync="dialogVisible" :destroy-on-close="true">
  <el-tabs>
    <el-tab-pane label="panel1" name="1">panel1内容</el-tab-pane>
    <el-tab-pane label="panel2" name="2">panel2内容</el-tab-pane>
  </el-tabs>
</el-dialog>
```

关闭弹窗时会卡死，具体条件如下，三者缺一不可：

1. el-dialog 包含 el-tabs
2. el-dialog 设置了 `:destroy-on-close="true"`
3. el-dialog 和 el-tabs 在同一个组件中。即如果 el-tabs 在 el-dialog 的子组件中就不会卡死。比如下面的代码就不会卡死：

```html
<!-- ParentComponent -->
<el-dialog :visible.sync="dialogVisible" :destroy-on-close="true">
  <ChildComponent />
</el-dialog>

<!-- ChildComponent.vue: -->
<el-tabs>
  <el-tab-pane label="panel1" name="1">panel1内容</el-tab-pane>
  <el-tab-pane label="panel2" name="2">panel2内容</el-tab-pane>
</el-tabs>
```

这第三点真的很奇怪，值得探究一下，但是我对 element-ui 怨念太深，实在看不了一点。PASS！
