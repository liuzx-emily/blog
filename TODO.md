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

vue3：

```js
const list = ref([]);
const task = { id: 1, name: "foo" };
list.value.push(task);

task.name = "bar"; // 视图不响应
```

---

vue2 和 vue3 区别汇总：

eslint 规则不同

---

css `background-attachment`

https://developer.mozilla.org/en-US/docs/Web/CSS/background-attachment

---

npm 系列

- scope
  https://docs.npmjs.com/about-scopes
  https://docs.npmjs.com/package-scope-access-level-and-visibility
- [npm pack](https://docs.npmjs.com/cli/v10/commands/npm-pack)

一些好玩的 npm 命令，可以放在一篇文章里

- [npm ci](https://docs.npmjs.com/cli/v10/commands/npm-ci/)
- [npm doctor](https://docs.npmjs.com/cli/v10/commands/npm-doctor)
- [npm explain](https://docs.npmjs.com/cli/v10/commands/npm-explain)
- [npm ls](https://docs.npmjs.com/cli/v10/commands/npm-ls)
- [npm outdated](https://docs.npmjs.com/cli/v10/commands/npm-outdated),npm update
- [npm pkg](https://docs.npmjs.com/cli/v10/commands/npm-pkg)
- [npm prune](https://docs.npmjs.com/cli/v10/commands/npm-prune)

---

csdn 中的草稿搬过来

---

super-dev 中检查文章分类是否有效。
但是如果在运行期间 categories.js 变化了，脚本中 import 的 categories 数据还是原先那份，所以检验失效了。

每次现 readFile 应该可行。动态 import 不知道行不行？

---

npm workspace

https://docs.npmjs.com/cli/v10/using-npm/workspaces

---

研究如何让 pre[collapsed]

---

asset 内容如果有中文，在网站上看会乱码。

装了一个修改 http 请求头响应头的插件，一通测试发现给 response header 设置 content-type ：text/plain; charset=utf-8 就可以了。
（之前没有 content-type）

不知道为什么 需要继续研究

---

分类和 tag 需要重新组织一下？：建一个 CI 分类？

---

跳转到文章时自动滚动至指定标题的功能失效。

```js
window.addEventListener("scroll", function () {
  debugger;
  console.log("scroll");
});
```

发现页面加载后触发了两次 scroll：

- 第一次 scroll 是我触发的“自动滚动至指定标题”
- 第二次 scroll 不知道是怎么处罚的，call stack 中没有显示。
