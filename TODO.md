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

可以用 pnpm ？！参考 vue https://github.com/vuejs/core/blob/main/.github/workflows/release.yml

---

vue3：

```js
const list = ref([]);
const task = { id: 1, name: "foo" };
list.value.push(task);

task.name = "bar"; // 视图不响应
```

---

css `background-attachment`

https://developer.mozilla.org/en-US/docs/Web/CSS/background-attachment

---

vue2 和 vue3 区别汇总

---

npm 系列

- [npm init](https://docs.npmjs.com/cli/v10/commands/npm-init)
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

eslint-plugin-vue 默认是 vue3 的。如果项目使用 vue2，记得设置

```js
...pluginVue.configs['flat/recommended'],
// ...pluginVue.configs['flat/vue2-recommended'], // Use this if you are using Vue.js 2.x.
```

不然会出错：比如这一条 https://eslint.vuejs.org/rules/no-deprecated-v-bind-sync.html

我又在 vscode 里设置了“保存时自动 fix eslint 发现的 error”。所以保存时会把 `:visible.sync="dialogVisible"` 自动改成 `v-model:visible="dialogVisible"`。但后一种语法在 vue2 里不认。

记得把 lily-cli 中的 eslint 也改一下。

---

super-dev 中检查文章分类是否有效。
但是如果在运行期间 categories.js 变化了，脚本中 import 的 categories 数据还是原先那份，所以检验失效了。

每次现 readFile 应该可行。动态 import 不知道行不行？

---

npm workspace

https://docs.npmjs.com/cli/v10/using-npm/workspaces
