git 443 error, git set vpn proxy

`git config --global http.proxy http://127.0.0.1:7890`

`git config --global https.proxy http://127.0.0.1:7890`

---

you cannot change svg color in html using css. but you can use filter

[see link](https://stackoverflow.com/questions/22252472/how-can-i-change-the-color-of-an-svg-element)

---

在 npm script 中使用 & 并行执行多个命令：`npm run foo & npm run bar`

但是我使用后发现并非如此：foo 如果不会自动终止进程（比如说代码中有 watch），那么后面的 bar 永远不会执行，这显然不是并行的效果。可能是因为 windows 不认 `&`，仍然当作串行执行。

这种情况就要 child_process 了。

nodejs 的兼容性问题还是蛮多的，再举一个例子：https://nodejs.cn/api-v16/cli/watch_path.html

---

"dev": "cd build-static-html && pnpm install && npx vite serve" 最后一个命令如果不用 npx 会报错，因为 vite 是装在子目录下的，不是根目录下的。

---

gitignore 不会自动去掉已经被 add 的文件。要先`git rm -rf --cached .`再`git add .`

---

首页中左侧标签和右侧文章标签使用同样的 .class，但呈现出的颜色不同。经测试，发现是页面出滚动条就会使左侧标签颜色变化。后发现是因为左侧标签是 sticky。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <style>
      .container {
        position: sticky;
        top: 0;
      }
      .post-tag {
        padding: 14px;
        margin: 8px 0;
        color: #29b6f6;
        outline: 1px solid #d4ebf5;
      }
    </style>
  </head>
  <body>
    <!-- 调整窗口大小。当页面出现滚动条时，post-tag颜色会变 -->
    <p>hello</p>
    <div class="container">
      <div class="post-tag">npm(7)</div>
      <div class="post-tag">flex(2)</div>
      <div class="post-tag">算法(2)</div>
      <div class="post-tag">vite(2)</div>
      <div class="post-tag">p5(2)</div>
      <div class="post-tag">eslint(2)</div>
      <div class="post-tag">rollup(2)</div>
      <div class="post-tag">typescript(2)</div>
    </div>
  </body>
</html>
```

---

不要用相对路径，要用 `process.cwd()` 或 `__dirname`。不然的话，在不同目录下执行命令会有不同的结果。

---

vue 中 ref 和 shallowRef（处理大数据）

当数据量过大时，即使用 shallowRef 也可能卡顿。

```js
const arr = shallowRef([1, 2, 3]);
while (循环五万次) {
  arr.value.push(i);
}
```

上面的代码会有明显卡顿，应该改成：

```js
const arr = shallowRef([1, 2, 3]);

const _temp = cloneDeep(arr.value);
while (循环五万次) {
  _temp.push(i);
}

arr.value = _temp;
```

---

GitHub workflow

---

vue3：

```js
const list = ref([]);
const task = { id: 1, name: "foo" };
list.value.push(task);

task.name = "bar"; // 视图不响应
```
