## TODO
开发阶段同时运行两个脚本有时会报错。每次重新生成/data/posts.js，vite都会报错说找不到文件。只有在家里的电脑可以稳定复现。

处理错误分类的 blog，现在写在 src 里面了。挪到 build 里

草稿 isDraft。在网站上不显示

- 需要逐一检查 post.md

  - 确认真实的 updatetime
  - 有没有无效图片
  - 无效语法，比如 =aa=

- dist/post.html

  - pre code 的样式
  - 加目录

- dist/index.html 的内容

  - 标签太多了，sticky 时放不下。
  - 检索的顶部条太丑了。。。改漂亮点

- 写 command/clearUselessPostAssets：清理用不到的图片

发现有的图片大小为 0，数量不多，直接人工处理吧。

---

jelykk 安装失败，不费劲了

试试 showdown，可以正常转换 md to html

写方法提取 metadata

发现 showdown 转换的 pre 没有语法高亮，用 showdown-highlight。成功 pre 中已经划分好了 class，但是没有对应的样式。
去 highlight 的官网，找了一个样式

搞一个模板。为了方便操作安装 jsdom。

postId 持久化。这样就可以收藏某篇文章了。不然每次 build，postId 都重新赋值。

download 方法有问题。。再试就失败了。。还是 csdn 校验的事
不能再次调用 download 了。因为下载的博文我已经进一步处理过了，比如：加 title。改掉本地 md 不认识的语法，比如==
检查的过程中发现以前的格式不太好看(图片前后没换行)，我都顺手改了。
所以不能再 download 了！！

说明：
post.md 的文件名是:`${日期}_${名称 1}.md`

post 的 metadata 中有 title,记为{名称 2}

名称 1 用来生成所有文件名，比如 post.html。名称 1 不能包含\/:?等字符
名称 2 用来 post.html 中的 title 和大标题。名称 2 没有格式限制

处理图片路径是一个难点。
- build-static-html 中图片必须放在 public 里。因为文章正文是通过 v-html 注入的。vite 打包时并不知道这些图片会被用到。

`dev-generate-data` 和 `generate-data` 根据 参数区分是否持续watch。分别给本地开发和部署时用。
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
- github workflow 不能用 pnpm，因为不支持。报错：Dependencies lock file is not found in /home/runner/work/liuzx-emily/liuzx-emily. Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock
- gitignore 不会自动去掉已经被 add 的。要先`git rm -rf --cached .`再`git add .`
