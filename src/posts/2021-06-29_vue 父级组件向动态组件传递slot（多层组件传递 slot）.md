---
id: da87bad1-b882-427e-88b0-af9886045627
title: vue 父级组件向动态组件传递slot（多层组件传递 slot）
createTime: 2021-06-29
updateTime: 2021-06-29
categories: vue
tags:
description:
---

## vue 父级组件向动态组件传递 slot

### 需求描述

- 多层组件 A->B->C
- B 中有动态组件 `<component :is="动态组件" />`，根据情况在 C1 C2 C3（统称为 C）中切换
- A 要经由 B 向 C 传递 slot

### 错误写法、原因

错误写法：（伪代码）

```html
<!-- 组件A -->
<组件B>
	<template v-slot:buttons> buttons </template>
</组件B>
```

```html
<!-- 组件B -->
<component :is="component">
  <slot name="buttons"></slot>
</component>
```

```html
<!-- 组件C -->
<section>
  <header>组件C</header>
  <slot name="buttons"></slot>
</section>
```

错误原因：**A 向 B 传递了 slot:buttons, B 也接受了。但是 B 没有向 C 传递 slot**
![在这里插入图片描述](..\post-assets\df605a92-9cc7-4dc8-b737-d959429c1811.png)

### 正确写法

把组件 B 改成：

```html
<!-- 组件B -->
<component :is="component">
  <!-- B向C传递slot -->
  <template v-slot:buttons>
    <slot name="buttons"></slot>
  </template>
</component>
```

### 改成不同名字，方便理解

B 组件中，从 **A 拿到的 slot** 和 **给 C 传递的 slot** 的名称是可以不一样的。
下面给他们改成不同名字，这样更容易理解传递的过程：

```html
<!-- 组件A -->
<组件B>
	<template v-slot:slotHello> Hello </template>
</组件B>
```

```html
<!-- 组件B -->
<component :is="component">
  <template v-slot:slotWorld>
    <span>你好呀</span>
    <slot name="slotHello"></slot>
  </template>
</component>
```

```html
<!-- 组件C -->
<section>
  <header>组件C</header>
  <slot name="slotWorld"></slot>
</section>
```

最终插槽中的内容是：`你好呀 Hello`

---

## 多层组件传递 slot

其实，上面出现的错误写法和动态组件没什么关系，就是多层组件传递 slot 的问题。

下面的代码演示了多层组件传递 slot 的多种情形：

```html
<!-- Home.vue -->
<father>
  <template v-slot:fatherSlot1>
    <span> Home传给Father </span>
  </template>
</father>
```

```html
<!-- Father.vue -->
<section>
  <son>
    <template v-slot:sonSlot1>
      <template v-if="$slots.fatherSlot1">
        <span> 这里是Father，我收到 Home 传来的 fatherSlot1 插槽：</span>
        <slot name="fatherSlot1"></slot>
      </template>
      <span v-else class="blue">这里是Father，我没有收到Home传来的 fatherSlot1 插槽</span>
    </template>
    <template v-slot:sonSlot2>
      <template v-if="$slots.fatherSlot2">
        <span> 这里是Father，我收到 Home 传来的 fatherSlot2 插槽：</span>
        <slot name="fatherSlot2"></slot>
      </template>
      <span v-else>这里是Father，我没有收到Home传来的 fatherSlot2 插槽</span>
    </template>
    <template v-slot:sonSlot3>
      <span>Father 向 Son 传递 sonSlot3 插槽 </span>
    </template>
  </son>
</section>
```

```html
<!-- Son.vue -->
<section>
  <p>
    sonSlot1:
    <slot name="sonSlot1">sonSlot1 没有接收到 Father 传来的同名插槽</slot>
  </p>
  <p>
    sonSlot2:
    <slot name="sonSlot2">sonSlot2 没有接收到 Father 传来的同名插槽</slot>
  </p>
  <p>
    sonSlot3:
    <slot name="sonSlot3">sonSlot3 没有接收到 Father 传来的同名插槽</slot>
  </p>
  <p>
    sonSlot4:
    <slot name="sonSlot4">sonSlot4 没有接收到 Father 传来的同名插槽</slot>
  </p>
</section>
```

结果：
![在这里插入图片描述](..\post-assets\e770371f-4c32-4b43-a6a7-3fe9619a2e1b.png)
