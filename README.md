## Usage

### 本地开发

首次运行先安装依赖 `npm run init`

开两个 Terminal，分别执行 `npm run generate-data-dev` 和 `npm run serve`

注意事项：

- post.md 的文件名格式为 `[日期]_[文章标题].md`
  - `[日期]` 纯粹是为了更直观的展示时间，并不会使用这个值。后续获取文章时间都是从 md 内容中的 metadata.createTime（应该保证这两个值相同）
  - `[文章标题]` 也是为了直观展示名字，并不会使用这个值。后续获取文章标题都是取 md 内容中的 metadata.title（无法保证两个值相同，因为文件名称中不能含有特殊符号，但是 metadata.title 中可以）

### 写文章注意事项

markdown 中不允许出现 h1；允许出现 h6，但不显示在文章详情页面的目录中。

### 本地预览部署效果

`npm run preview`

### 部署到 github pages

设置了 github workflow。每次 push 的时候会自动部署。详见 `.github/workflows`

---

## 目录结构：

- build-static-html 用来生成静态页面的子项目
  - `data/`: 数据来源，包含 posts 和 categories，执行 `npm run generate-data` 自动生成（gitignore）
  - `public/post-assets`: posts 中引用的图片，也是执行 `npm run generate-data` 自动生成的（gitignore）
- commands 所有命令
  - `batch-modify-md`: 批量修改 md 文件，不修改源文件，将修改后的内容输出到另一文件夹。
  - `batch-scan-md`: 批量扫描 md 文件
  - `generate-data`: 根据 src 自动生成数据文件，给 build-static-html 使用
  - `test-parallel-run`: 尝试结合 `generate-data` 和 `dev`，还未成功.
- src 源文件
  - `post-assets/`: post 中引用的资源（图片）
  - `posts/`: markdown post
  - `categories.js`: 分类数据。因为分类存在父子关系，所以需要显示设置

---

## Commands

```js
// 寻找在markdown中引用但不存在的图片；寻找未使用的图片并自动删除
"clear-useless-assets": "node commands/clear-useless-assets.js",
// 调试用工具
"batch-modify-md": "node commands/batch-modify-md.js",
"batch-scan-md": "node commands/batch-scan-md.js",
// 初始化安装依赖，包括根目录、子项目
"init": "npm install && cd build-static-html && npm install",
// 生成数据文件
"generate-data-dev": "node commands/generate-data.js --dev",
"generate-data": "node commands/generate-data.js",
// 本地开发，开启 vite server
"serve": "cd build-static-html && npm run dev",
// 本地预览部署效果
"preview": "npm run generate-data && cd build-static-html && npm run build && npm run preview",
// 部署
"deploy": "npm run generate-data && cd build-static-html && npm run build",
// todo
"try-parallel-run(still-not-succeed)": "test-parallel-run.js"
```
