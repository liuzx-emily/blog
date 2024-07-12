## Usage

### 本地开发

安装依赖 `npm install`

开两个进程，分别执行 `npm run dev-generate-data` 和 `npm run dev`

注意事项：
- post.md 的文件名格式为 `${日期}_${名称}.md`
  - `${日期}` 纯粹是为了更直观的展示时间，并不会使用这个值。后续获取文章时间都是从 md 内容中的 metadata.createTime（应该保证这两个值相同）
  - `${名称}` 也是为了直观展示名字，并不会使用这个值。后续获取文章标题都是取 md 内容中的 metadata.title（无法保证两个值相同，因为文件名称中不能含有特殊符号，但是 metadata.title 中可以）

### 部署到 github pages

设置了 github workflow。每次 push 的时候会自动打包、部署。详见 `.github/workflows`


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
