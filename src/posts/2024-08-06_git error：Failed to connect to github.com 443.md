---
id: c4676c26-beb7-4b95-8239-5d1c14b4ebbe
title: git error: Failed to connect to github.com 443
createTime: 2024-08-06
updateTime:
categories:
tags: git
description: 国内访问 github 不稳定，经常被墙，导致 git clone 报错 Failed to connect to 443。需要给 git 设置使用 vpn
---

有的时候从 github 上 clone 代码会失败，报错：`Failed to connect to github.com 443`。

这是因为国内访问 github 不稳定，经常被墙。虽然我的电脑上有 vpn，但是默认情况下 git 不会使用它进行代理。需要配置 git 使用 vpn。

## 查看 proxy

查看 http proxy：

```bash
git config --global --get http.proxy
```

查看所有 http 配置：

```bash
git config --global --get-regexp http.*
```

## 设置 proxy

```cmd
git config --global http.proxy http://<proxyHost>:<port>

```

vpn 服务就在我的电脑上，所以 proxyHost 是 `127.0.0.1`。我使用 clash，端口为 `7890`。所以具体指令是：

```bash
git config --global http.proxy http://127.0.0.1:7890
```

设置好 proxy 之后，git 的 http 请求都会通过 vpn 了。执行命令如 `git clone <github-repo>`，在 Clash 的 log 里能看到请求记录。如果没有开启 vpn（即没有启动 clash），git 会报错：

```bash
fatal: unable to access 'xxxx': Failed to connect to 127.0.0.1 port 7890: Connection refused
```

注：使用 Clash 代理 git 时，只要启动 Clash 就可以，不需要开启 Clash 的 `System Proxy` 配置项。

## 取消 proxy

`git config --global --unset http.proxy`
