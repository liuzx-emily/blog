---
id: 4ce48b2b-d8a0-4705-97d1-2357e3d41685
title: 遇到 Resource interpreted as Stylesheet but transferred with MIME type text/html，可能是服务器设置了302
createTime: 2020-02-11
updateTime: 2020-02-11
categories: js
tags: 
description: 
---
## 问题
访问页面 login.html 后报错：
![在这里插入图片描述](..\post-assets\4d02c53e-2d43-45aa-8b85-117e7ed091e5.png)

## 什么情况会出现这个错误？

以下摘自 [Quentin 的回答](https://stackoverflow.com/a/22631253)：

Browsers make HTTP requests to servers. The server then makes an HTTP response.

Both requests and responses consist of a bunch of headers and a (sometimes optional) body with some content in it.

If there is a body, then one of the headers is the Content-Type which describes what the body is (is it an HTML document? An image? The contents of a form submission? etc).

When you ask for your stylesheet, your server is telling the browser that it is an HTML document (Content-Type: text/html) instead of a stylesheet (Content-Type: text/css).


也就是说，你向服务器请求一个类型为 `text/css` 的文件，但是服务器却返回了一个类型为 `text/html` 的文件。


## 具体原因和解决办法

造成这个问题的原因有很多，我这次遇到的是：

服务器加了登录限制，在未登录情况下，触发的任何请求都会被 302 重定向到登录页面。

所以，我在访问登录页面时，浏览器向服务器请求 **chunk-common.a4ed5276.css** 文件，被服务器拦截并重定向到 login.html 。如下图：

![在这里插入图片描述](..\post-assets\c3f2a55f-5c65-4b20-82a9-efc0fe8a7a96.png)
解决方法也很简单，让服务器把对这几个css、js的拦截都放开