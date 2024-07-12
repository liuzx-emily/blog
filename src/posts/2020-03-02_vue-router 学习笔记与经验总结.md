---
id: 41ba8cd3-4685-4f3c-a9f3-a8ada29ea66e
title: vue-router 学习笔记与经验总结
createTime: 2020-03-02
updateTime: 2020-03-02
categories: vue-router
tags: 
description: 
---

## 1 onReady

router 初始化是需要一定时间的。在主入口 App.vue 的 mounted 中，不能保证 router 初始化完成。所以要用 [onReady](https://router.vuejs.org/zh/api/#router-onready) ：在路由完成初始导航时调用

```js
this.$router.onReady(() => {
  console.log(this.$router);
});
```

## 2 定义路由时，children 字段

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

## 3 定义路由时，慎用 redirect

慎用 `redirect` ，因为登录者不一定有这个权限。  
举例：顶部 + 侧边导航。点击顶部导航 A ，需要自动跳转到 A 的第一个子菜单。因为每个登录者拥有的菜单权限不一样，所以不能 用 redirect 跳转。

## 4 配置 404 页面

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

因为配置了\*重定向到 404，所以一旦出现没有配置过的地址，就会立刻跳转到 404 页面。
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

## 5 一劳永逸解决"贴心的"组件复用，强制刷新

对于动态路由 `/user/:username`：

> 当使用路由参数时，例如从 /user/foo 导航到 /user/bar，原来的组件实例会被复用。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。不过，这也意味着组件的生命周期钩子不会再被调用。

可以按照官方推荐的方法解决，具体看[这里](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html#%E5%93%8D%E5%BA%94%E8%B7%AF%E7%94%B1%E5%8F%82%E6%95%B0%E7%9A%84%E5%8F%98%E5%8C%96)：

- watch (监测变化) $route 对象
- 在 beforeRouteUpdate 中处理

更一劳永逸的办法是，在 App.vue 中：

```html
<router-view :key="$route.fullPath"></router-view>
```

只要这种 $route.fullPath 变化，就会重新渲染组件。（`/detail/:id` 和 `/detail?id=3` 这两种情况都会触发重新渲染）

## 6 三种传参方法

- 方案 1：**参数以 queryString 的形式显示在地址栏中**，F5 也不会丢

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

- 方案 2：**参数显示在地址栏中**，F5 也不会丢
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
- 方案 3 ==【不推荐】==：**参数存在内存中**，F5 后就没了。
  只能获取 params 的初始值，**无法**监听到它的变化。
  通过 params 进行跳转时，不能用 path，**只能用 name**
  ```js
  this.$router.push({ name: "detail", params: { id: id } });
  ```
  配置路由时：**必须配置 name**
  ```js
  { name: "detail", path: "/detail", component: componentA }
  ```
  获取参数：
  ```js
  this.$route.params.id;
  ```