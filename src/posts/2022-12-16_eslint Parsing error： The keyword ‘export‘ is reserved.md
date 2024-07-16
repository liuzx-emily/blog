---
id: 0e9d5ee6-8c28-4b71-a4f9-0f05cd631efe
title: eslint Parsing error
createTime: 2022-12-16
updateTime: 2022-12-16
categories: 底层工具
tags: eslint
description: eslint language options
---

## 报错

![在这里插入图片描述](../post-assets/566c0a0f-f350-45fc-8192-e21661d980e5.png)

## 原因

ECMAScript modules(import/export) 是 es6 的语法。

根据 eslint 官方文档 [Configure language options](https://eslint.org/docs/latest/user-guide/configuring/language-options) ，eslint 默认使用 es5 语法：

![在这里插入图片描述](../post-assets/987a19f9-34d6-47d9-87a4-500f95cb6961.png)

## 解决

要让 eslint 知道我在使用 es6 的 modules 语法。有下面几种方法：

- 设置 env 为 es6：

  ```js
  // .eslintrc.js:
  module.exports = {
    env: {
      es6: true,
    },
  };
  ```

  此时还是会报错，但是报错内容变了：
  ![在这里插入图片描述](../post-assets/325374d3-b326-4dba-aff3-4f04b11889ab.png)

  这是因为虽然 es modules 是 es6 的功能，但是 eslint 中的 env: es6 是不包含 modules 功能的：
  ![在这里插入图片描述](../post-assets/1a974ec3-3254-40cb-b91a-4c05d7ea4211.png)
  根据报错内容的提示，将 parserOptions.sourceType 设为 module ![在这里插入图片描述](../post-assets/ec1fa1f0-7233-45fa-be14-975cc286d914.png)

  ```js
  module.exports = {
    env: {
      es6: true,
    },
    parserOptions: {
      sourceType: "module",
    },
  };
  ```

- ```js
  module.exports = {
    env: {
      es2016: true,
      // es2022:true,
    },
    // env: es2016 ~ es2022 都包含 es modules，不需要再设置 sourceType:module 了
  };
  ```
- ```js
  module.exports = {
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  };
  ```
