---
id: cea1399c-28b7-4168-9e80-6612d4c466be
title: 使用 vue-router，页面加载完成后，$route 的值不正确
createTime: 2020-01-20
updateTime:
categories: 前端组件
tags: vue-router
description: 页面加载完成时 route 的值是不正确的，因为此时 vue-router 可能还没有完成初始化，需要使用 onReady。
---

## 问题描述

页面加载完成时需要判断：地址能否匹配上路由，如果匹配不上就跳转到首页。

```js
mounted(){
	if (this.$route.matched.length === 0) {
		this.$router.push("/index");
	}
}
```

出现 bug：当地址可以匹配上路由时，也会跳到首页。

## 找到问题

在 mounted 中打印 `$route`：

![在这里插入图片描述](../post-assets/d7782366-b233-4ece-ba38-6d3a51913737.png)

可以看出所有的值都不对。最明显的是 `path` 和 `fullPath`，明明应该有值，但现在都是 `"/"` 。

我猜测：在 mounted 中，router 的初始化还没有完成，所以取到的是一个初始的默认值。

加一个延时，试一下：

```js
mounted(){
	setTimeout(() => {
		if (this.$route.matched.length === 0) {
			this.$router.push("/index");
		}
	},1000);
}
```

延时 1s ，此时 router 的值是对的了：

![在这里插入图片描述](../post-assets/5e07b753-77a3-4364-ab63-a227401e0d9d.png)

问题确定了：

- vue-router 初始化是需要一段时间的，在完成之前，取值只能拿到初始的默认值。
- 在 mounted 中 router 初始化可能还没有完成。

## 不能用延时，用 onReady

上面用定时器延迟 1s 后取到了正确的 router。但是要真正解决这个问题肯定不能用延时，因为延迟的时间无法确定：

- 长了，影响体验
- 短了，可能 router 初始化还没完成呢

我去翻了官网 API，希望官方提供了**初始化完成时的回调方法**，果然找到了：[onReady](https://router.vuejs.org/zh/api/#router-onready)

代码改成：

```js
mounted(){
	this.$router.onReady(() => {
		if (this.$route.matched.length === 0) {
			this.$router.push("/index");
		}
	});
}
```

完美通过！

## 担心：onReady 会不会错过？

### 错过指什么

先解释一下 “错过”。举个例子：监听 window 的 load 事件

```html
<script>
  window.onload = function () {
    alert("load");
  };
</script>
```

会正常弹窗。

如果延迟一会儿再绑定事件呢：

```html
<script>
  setTimeout(() => {
    window.onload = function () {
      alert("load");
    };
  }, 2000);
</script>
```

这样就不会弹出了。因为延迟了 2s ，绑定事件的时候 window 已经 load 完成了。错过了。

### onReady 会不会错过？

先说结论：**不会！**

因为 `window.onload` 和 vue-router 的 `onReady` 是完全不同的两种机制：

```js
// 机制一：绑定处理函数。绑定好之后，window触发load事件时，才会调用。所以存在错过的现象
window.onload = cb;

// 机制二：调用 onReady 函数！
router.onReady(cb);
```

查看 [vue-router 源码中](https://github.com/vuejs/vue-router/blob/dev/src/history/base.js) ：

![在这里插入图片描述](../post-assets/b9501e15-e6e0-4c40-8803-4d4657aa438c.png)

- 如果路由已经 ready 了，立即执行 `cb`。
- 如果路由还没有 ready，就把 `cb` 放到 `readyCbs` 中。等待 ready 后执行

所以，onReady 不会错过，放心的用！
