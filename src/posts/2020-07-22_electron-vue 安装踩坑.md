---
id: b8fa092b-032f-4bde-a5f2-60ac8572d8c1
title: electron-vue 安装踩坑
createTime: 2020-07-22
updateTime: 2020-07-22
categories:
tags:
description: 记录按照官网说明安装 electron-vue 时遇到的问题
---

按照[官网](https://electron.org.cn/vue/getting_started.html#a-note-for-windows-users)的说明来安装：

```m
# 安装 vue-cli 和 脚手架样板代码
npm install -g vue-cli
vue init simulatedgreg/electron-vue my-project

# 安装依赖并运行你的程序
cd my-project
yarn
yarn run dev
```

---

###### 执行 vue init 时，一直卡在 downloading template

![在这里插入图片描述](..\post-assets\16eda1f0-2ae3-48c4-bf77-2b7481c2f674.png)
最终使用**离线**初始化搞定了：先把模版下载到本地，然后直接用本地模版进行初始化。

- [下载模版](https://github.com/SimulatedGREG/electron-vue)，并解压
- 把解压后的文件夹，放到 `C:\Users\自己电脑的用户名\.vue-templates` 文件夹下
- 之后执行 `vue init <template-name> <project-name> --offline`

成功！

---

###### 项目运行后， Html Webpack Plugin 报错

![在这里插入图片描述](..\post-assets\d0caa940-b8ae-4640-8a1a-458d2fc0bb63.png)
参考 [ChrisKader](https://github.com/SimulatedGREG/electron-vue/issues/871#issuecomment-564302194) 的方法解决了：
![在这里插入图片描述](..\post-assets\3356315c-6d39-48c7-98f6-a5afa192d404.png)
改成
![在这里插入图片描述](..\post-assets\d03988e2-cd6e-4b5b-9038-b8ea9c2b5213.png)
成功！

---

###### npm run build 报错

![在这里插入图片描述](..\post-assets\bdd3d7ec-a504-4442-9b1a-3c38607caa44.png)

按照 [applek](https://music.junyuewl.com/electronvuebuilderro.html) 的方法解决了：
![在这里插入图片描述](..\post-assets\ca5970ef-dc08-469b-83b1-4315bed9a974.png)
关掉火绒，重新打包不报错了！
