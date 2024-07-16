## TODO

开发阶段同时运行两个脚本有时会报错：每次有变化重新生成/data/posts.js，vite 会报错说找不到文件（在家里的电脑可以稳定复现）

- 需要逐一检查 post.md

  - 无效语法，比如 =aa=

- dist/post.html

  - pre code 的样式
  - 加目录

- dist/index.html 的内容

  - 标签太多了，sticky 时放不下。
  - 检索的顶部条太丑了。。。改漂亮点

---

## 过程记录

一开始想用 Jekyll。但是在 windows 上安装很困难，按照官网上说的多种方法尝试均没有成功，放弃。决定自己开发。

决定用 markdown 格式。因为在 csdn 上已经写习惯了，而且也方便把之前在 csdn 上写的文章迁移过来。
需要考虑如何处理文章中的图片：每篇文章都会有很多图片，放在本地可能很占地方，会不会超过 github 仓库的限制？考虑过在线图床，但是放在别人那里还是不保险，哪天说没就没。最终出于稳定性考虑，还是决定放在本地。

因为部署到 GitHub pages 上的必须是静态的 html。所以我需要将 md 转换为 html，使用 showdown。测试后发现可以正常使用，但是转换的 pre 没有语法高亮。使用 showdown-highlight，成功转换，但是只是按语义划分好了 `.class`，没有对应的样式。我去 highlight 的官网扒了一个样式文件。

### 从 csdn 上下载文章

难点在于突破它的防爬虫机制。
以前写过一个爬虫，获取 csdn 上所有文章信息。那个比较简单，在网页登录后用 cookie 就行。这次需要拿到文章的 md 内容，调取的接口验证就复杂很多，根据文章 id 加密的，所以每篇文章“密码”不同。必须要找到他的加密方法。
成功获取了。但是第二天再重试就失败了。以后看看原因吧。
还有个问题，有的图片下载失败（size=0），不知道怎么回事。数量不多，手动处理了。
下载下来的文章信息不能直接用，需要处理。比如：不识别==语法，tags 是当时在 csdn 上使用的，不适合自建的网站（比如名为 js 的 tag 就没有什么意义。我已经有一个分类叫 js 了）
csdn 上获取到的 updateTime 数据不对，不要使用。

### .md 的内容

我在尝试使用 Jekyll 的时候，虽然没有成功运行，但是把它的代码成功加载下来了。我看到 Jekyll 的格式：由 metadata 和正文两部分组成。metadata 在 .md 顶端，由 `---` 包裹起来，每行格式为 `[key]: [value]`。

我觉得这样很好。把正文和 metadata 放在同一个文件中，以后写文章会很方便（不用在一个文件改完正文，还要去另一个文件改它的 tag）。

只要规定好格式并严格遵守。就可以保证能正确提取 metadata 和正文。

### .md 的命名

也是参考 Jekyll。采用 `[日期]_[文章标题].md`。
添加`[日期]`并放在文件名起始位置是为了让 .md 能够按日期排序（虽然现在是日期最早的在前面，有点不方便。。）。
`[文章标题]`也是为了能更直观的识别文章。

注：我写了一个爬虫，从 csdn 上下载我的所有文章。遇到一个问题：文章名称有非法字符\/:?等，直接放在文件名中会报错，需要处理。

文件名中的 `[日期]` 和 `[文章标题]` 后续并不会使用。后面需要时都是从 metadata 中获取的。
但是应该保证 `[日期]` 和 metadata.createTime 相同。`[文章标题]` 和 metadata.title **基本**相同（因为 metadata.title 可以有\/:?等字符）

### 生成策略

#### 阶段 1

那时候对 nodejs 还很新鲜，非常想用它实现）

全用 fs.writeFile 写, jsDom 辅助，非常原始野性的写法。。。

比如说实现文章列表，借助 jsDom：

```js
const ul = document.createElement("ul");
posts.forEach((post) => {
  const li = document.createElement("li");
  li.innerHTML = "...略";
});
```

#### 阶段 2

用模板。读取的 mdPosts 作为数据注入。

还是拿文章列表举例。提前写好 template/list.html：

```html
<script src="data/post.js"></script>
<div id="app">
  <ul>
    <li v-for="o in posts">...略</li>
  </ul>
</div>
```

每次读取完 posts，写入 data/posts.js 文件。

#### 阶段 3

我已经很多年不这样开发了，极度不习惯：

- 很多想用的库找 iife 版本都很费劲（element-ui 的官网说有，但实测并不能用）
- 页面不能拆分成组件，只能全放在一起
- script 没有模块化
- 没有 eslint
- 样式没有 scoped。不能用 scss 的嵌套样式

忍无可忍！我下定决定，必须要改成 vite-vue 项目（其实在阶段 2 早期我就有这个想法了。当时只是想挑战一下自己，没想到写多了发现痛苦万分。从未来可能的挑战变成刻不容缓！）

从逻辑上，我决定应该把这个项目作为子项目。但是我决定先放在根目录，让项目能成功运行。

### 阶段 4

把 vite 项目挪到子文件夹中。目录层级更清晰了。

### 提取 metadata

注意处理各种边界情况：

- 当 value 为空时，格式化后会变为 `[key]:` ——冒号后面的空格没了。
- 忘了。。

### postId 持久化

一开始 post 是每次随机生成的。每次 generate-data, postId 都会变。这样就无法收藏某篇文章了。
决定还是要把 postId 持久化，只能作为 metadata 存在 post.md 里。

### 处理图片路径

处理图片路径是一个难点。

- 要保证 post.md 中图片路径正确，即在 vscode 中执行 `Markdown: Open Preview` 时能看到图片
  - markdown 中统一图片路径中的目录分隔符（用\还是/）。从 CSDN 下载转换的数据中有\，我新添加的图片是/。其实这两种都可以，但是要规定一种，统一的格式方便后续处理。决定统一成/，因为我添加新图片使用 vscode 的 markdown 插件，它是用 /。
- 要保证本地开发时，图片路径正确。
- 要保证部署到 GitHub pages 上后，图片路径正确。

build-static-html 中图片必须放在 public 里。因为文章正文是通过 v-html 注入的，虽然在 dev 阶段没有影响，但是 build 时 vite 并不知道这些图片会被用到，只有放在 public 中才会留下。

### 其他

github workflow 不支持 pnpm。在 github actions 中可以看到报错：`Dependencies lock file is not found in /home/runner/work/liuzx-emily/liuzx-emily. Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock`

`dev-generate-data` 和 `generate-data` 根据 参数区分是否持续 watch。分别给本地开发和部署时用。

sticky 的内容会变颜色。不能用鲜艳的颜色，变动会很明显。

在 generate-data 中处理错误分类。

草稿 draft。仅在开发模式下显示

---

## blog idea

- position:sticky
- git 443 error, git set vpn proxy
  - git config --global http.proxy http://127.0.0.1:7890
  - git config --global https.proxy http://127.0.0.1:7890
- you cannot change svg color in html using css. but you can use filter
  [see link](https://stackoverflow.com/questions/22252472/how-can-i-change-the-color-of-an-svg-element)
- script 想要用 & 同时执行多个命令。但是命令 1 里面有 watch 等不会自动终止进程的。所以后面的永远不会执行。必须用 child_process
  - 可能是因为 windows 不认&，效果&&
    - 用 nodejs 的兼容性问题还是蛮多的 https://nodejs.cn/api-v16/cli/watch_path.html
- "dev": "cd build-static-html && pnpm install && npx vite serve" 最后一个命令如果不用 npx 会报错

- gitignore 不会自动去掉已经被 add 的。要先`git rm -rf --cached .`再`git add .`
- 首页中左侧标签和右侧文章标签使用同样的 .class，但呈现出的颜色不同。经测试，发现是页面出滚动条就会使左侧标签颜色变化。后发现是因为左侧标签是 sticky
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
