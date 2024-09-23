---
id: abf5c35c-3656-4162-89c1-742efac46c65
title: gitignore 无法忽略已经 tracked 的文件
createTime: 2024-08-16
updateTime:
categories: git
tags:
description:
---

gitignore 只对未 tracked 的文件生效。对于已经 tracked 的文件，在 .gitignore 中添加针对它的规则并不会起作用。

假设已经 tracked 的文件为：dir1/foo.txt，需要执行：

```bash
# untrack it
git rm --cached dir1/foo.txt
# sometimes you'll need to do this after rm --cached to properly rebuild the index.
git add .
```

也可以使用 `.` 通配符：

```bash
git rm -r --cached .
git add .
```

---

[git rm](https://git-scm.com/docs/git-rm) ：

- `--cached`: Unstage and remove paths **only** from the index. Working tree files, whether modified or not, will be left alone.
- `-r` Allow recursive removal when a leading directory name is given.
