---
id: a02af511-f36b-45d7-9676-5d6078c3133a
title: extends in typescript
createTime: 2023-02-23
updateTime:
categories: 底层工具
tags: typescript
description: extends in typescript
---

## 困惑

初学 ts 时，extends 让我很困惑：有时它代表 _扩大_ ，有时代表 _缩小_ 。举几个例子说明：

###### 例 1：

```js
class Animal {}
class Dog extends Animal {}
```

这是 js 本身就有的 class 继承语法，很熟悉了。
Dog 是 Animal 的子类，是对 Animal 的扩展，可以比 Animal 有更多的属性和方法。
extends 似乎代表 _扩大_

###### 例 2：

```js
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

`K extends keyof T` 的含义是“K 是 keyof T 的子集”。K 的取值被限制在 keyof T 内，可以少，不能多。
extends 似乎代表 _缩小_

###### 例 3：

```ts
function longest<T extends { length: number }>(a: T, b: T) {
  return a.length >= b.length ? a : b;
}
```

`T extends { length: number }` 要求 T 必须有 length 属性，这样在函数体中才可以直接使用 a.length 和 b.length。
T 除了 length，还可以有其他属性和方法。
extends 似乎代表 _扩大_

---

## 解释

说扩大或者缩小其实含义很模糊，没有实际意义。因为没有明确主语：具体是什么扩大/缩小了。

ts 中的 extends 应该用 _子类型（assignable）_ 去理解。

> 子类型：如果在期望类型 T 的实例的任何地方，都可以安全地使用类型 S 的实例，那么称类型 S 是类型 T 的子类型。

如果我们能够把任何值赋给类型 T，那么称 T 为顶层类型。其他任何类型都是 T 的子类型。ts 中的顶层类型是 `unknown`，java 中的顶层类型是 `Object`。

如果类型 T 是其他任何类型的子类型，那么称 T 为底层类型。ts 中的底层类型是 `never`，是不能被赋值的空类型。可以类比集论中的概念：空集是任何集合的子集。

大白话总结：`unknown` 是终极父类，`never` 是终极子类。

所以，_子类型 extends 父类型_，至于是扩大还是缩小要看考虑问题的角度。用上面的例 1 说明：

```js
class Animal {}
class Dog extends Animal {}
```

- Dog 比 Animal 有更多的属性和方法。这个角度看，Dog 是对 Animal 的扩展。
- Dog 对 Animal 加了限制，所以 Dog 能取的值比 Animal 要少：Dog 一定是 Animal，但 Animal 不一定是 Dog。这个角度看，Dog 是对 Animal 的缩小

大白话总结：子类特性多了，可取值少了。

---

## 引申

前提 Dog extends Animal，考虑下面几种类型的关系：

- `Dog[]` 和 `Animal[]` 的关系
- `() => Dog` 和 `() => Animal` 的关系
- `(arg:Dog) => void` 和 `(arg:Animal) => void` 关系

答案：

- `Dog[]` 是 `Animal[]` 的子类型
- `() => Dog` 是 `() => Animal` 的子类型
- `(arg:Animal) => void` 是 `(arg:Dog) => void` 的子类型。<span style="color:darkorange">注意这里反过来了。稍微有点绕，用 assignable 的思路去考虑</span>

另外，ts 中强行规定了 `(arg:Dog) => void` 也是 `(arg:Animal) => void` 的子类型。这样是不安全的，运行时可能出错。但是 ts “为了方便实现常见的 js 编程模式“，就是这样设计了。

---

最后说一说 ts 中的 any。虽然 any 和 unknown 常被放在一起讨论，但其实性质完全不同。在 ts 中，`unknown` 和 `never` 都是正规的类型体系的一部分。但 any 完全在这个体系之外：

> ts 中，所有值都可以赋给 any 类型，any 类型的值也可以赋值给其他任何类型，从而绕过类型检查。

写代码时如果用了 any 类型，就代表着：我完全知道我在做什么，这一部分代码的安全与正确性我自己负责。ts 请无视这段代码，不要进行任何类型检查。
