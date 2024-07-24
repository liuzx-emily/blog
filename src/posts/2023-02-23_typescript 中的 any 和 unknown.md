---
id: af85cde7-33ac-46d8-8742-face3aece803
title: typescript 中 any 和 unknown 的区别
createTime: 2023-02-23
updateTime:
categories: typescript
tags:
description:
---

虽然 any 和 unknown 常被放在一起讨论，但其实性质完全不同。在 ts 中，`unknown` 和 `never` 都是正规的类型体系的一部分。但 any 完全在这个体系之外：

> ts 中，所有值都可以赋给 any 类型，any 类型的值也可以赋值给其他任何类型，从而绕过类型检查。

写代码时如果用了 any 类型，就代表着：我完全知道我在做什么，这一部分代码的安全与正确性我自己负责。ts 请无视这段代码，不要进行任何类型检查。
