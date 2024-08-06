## Usage

### 本地开发

首次运行先安装依赖 `npm run init`

#### 仅修改页面

`npm run generate-data-draft` 获取数据文件
`npm run serve` 开启服务器

在 build-static-html 目录下修改内容

#### super dev 模式

`npm run super-dev`

执行此命令会开启 vite 服务器。并实时监听 posts.md、assets 和 categories 的变化，生成数据文件，并自动刷新页面。

### 写文章注意事项

post.md 的文件名格式为 `[日期]_[文章标题].md`

- `[日期]` 纯粹是为了更直观的展示时间，并不会使用这个值。后续获取文章时间都是从 md 内容中的 metadata.createTime（应该保证这两个值相同）
- `[文章标题]` 也是为了直观展示名字，并不会使用这个值。后续获取文章标题都是取 md 内容中的 metadata.title（无法保证两个值相同，因为文件名称中不能含有特殊符号，但是 metadata.title 中可以）

markdown 中不允许出现 h1；允许出现 h5 h6，但不显示在文章详情页面的目录中。

### 本地预览部署效果

`npm run preview`

### 部署到 github pages

设置了 github workflow。每次 push 的时候会自动部署。详见 `.github/workflows`

---

## 目录结构：

- build-static-html 用来生成静态页面的子项目
  - `data/`: 数据来源，包含 posts 和 categories，通过脚本自动生成（gitignore）
  - `public/post-assets`: posts 中引用的图片，通过脚本自动生成（gitignore）
- scripts 所有脚本。具体说明见 package.json 中的 scriptsComments
- src 源文件
  - `post-assets/`: post 中引用的资源（图片）
  - `posts/`: markdown post
  - `categories.js`: 分类数据。因为分类存在父子关系，所以需要显式设置
