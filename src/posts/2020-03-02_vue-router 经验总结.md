---
id: 41ba8cd3-4685-4f3c-a9f3-a8ada29ea66e
title: vue-router 经验总结
createTime: 2020-03-02
updateTime:
categories: 前端组件
tags: vue-router
description:
---

## onReady

router 初始化是需要一定时间的，mounted 中无法保证 router 初始化完成。[onReady](https://router.vuejs.org/zh/api/#router-onready)：

```js
this.$router.onReady(() => {
  console.log(this.$router);
});
```

具体见 [《使用 vue-router，页面加载完成后，$route 的值不正确》](post:cea1399c-28b7-4168-9e80-6612d4c466be)

注：vue-router@4 中 `onReady` 改为 `isReady`

## 定义路由时 children 字段

- children 写法：页面 B 会被嵌套在页面 A 的 `<router-view>` 中

  ```js
  const routes = [
    {
      path: "/a",
      component: 页面A,
      children: [{ path: "b", component: 页面B }],
    },
  ];
  ```

- 平铺写法：页面 B 和页面 A 没有关系
  ```js
  const routes = [
    { path: "/a", component: 页面A },
    { path: "/a/b", component: 页面B },
  ];
  ```

## 定义路由时慎用 redirect

慎用 `redirect` ，因为登录者不一定有这个权限。

举例：用户点击菜单 A，需要自动跳转到 A 的第一个子菜单。但是每个登录者拥有的菜单权限不一样，所以不能在定义路由时设置 redirect 跳转，而要用 js 判断登录者身份权限后手动跳转。

## 配置 404 页面

```js
const routes = [
  // ......
  {
    name: "404",
    path: "/404",
    component: () => import("~/pages_example/page_index/views/404.vue"),
  },
  // ......
  // 因为路由表是由上到下匹配的，所以要把*放在最下面
  {
    path: "*",
    redirect: "/404",
  },
];
```

因为配置了`*`重定向到 404，所以一旦出现没有配置过的地址，就会立刻跳转到 404 页面。

下面这种情况，访问 `/a/b` 时，就会立刻跳转到 404 页面

```js
{
    path: '/a',
    component: () => import('../blank.vue'),
    children: [
	    {
	        path: 'b/c1',
	        component: component1
	    },
	    {
	        path: 'b/c2',
	        component: component2
	    },
	]
}

```

## 一劳永逸解决"贴心的"组件复用，强制刷新

对于动态路由 `/user/:username`：

> 当使用路由参数时，例如从 /user/foo 导航到 /user/bar，原来的组件实例会被复用。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。不过，这也意味着组件的生命周期钩子不会再被调用。

可以按照官方推荐的方法解决，具体看[这里](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html#%E5%93%8D%E5%BA%94%E8%B7%AF%E7%94%B1%E5%8F%82%E6%95%B0%E7%9A%84%E5%8F%98%E5%8C%96)：

- `watch($route)`
- 在 `beforeRouteUpdate` 中处理

更一劳永逸的办法是，在 App.vue 中：

```html
<router-view :key="$route.fullPath"></router-view>
```

只要 `$route.fullPath` 变化，就会重新渲染组件。（`/detail/:id` 和 `/detail?id=3` 这两种情况都会触发重新渲染）

## 三种传参方法

###### 1. 参数作为 queryString

参数以 queryString 的形式显示在地址栏中，刷新页面也不会丢失参数。

```js
this.$router.push({ name: "detail", query: { id: id } });
```

配置路由时：

```js
{ name: "detail", path: "/detail", component: componentA }
```

获取参数：

```js
this.$route.query.id;
```

###### 2. 参数是地址的一部分

参数显示在地址栏中，刷新页面不会丢失参数

```js
this.$router.push({ path: `/detail/${id}` });
```

配置路由时：

```js
{ path: "/detail/:id", component: componentA }
```

获取参数：

```js
this.$route.params.id;
```

###### 3. 参数放在内存中

参数不放在地址中，放在内存里，刷新页面后参数丢失。

只能获取 params 的初始值，**无法**监听到它的变化。

通过 params 进行跳转时，不能用 path，只能用 name

```js
this.$router.push({ name: "detail", params: { id: id } });
```

配置路由时必须配置 name

```js
{ name: "detail", path: "/detail", component: componentA }
```

获取参数：

```js
this.$route.params.id;
```
