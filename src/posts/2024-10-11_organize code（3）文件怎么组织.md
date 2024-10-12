---
id: 892cf293-a173-46bc-960a-c3fe4f4ee4ca
title: organize code（3）文件怎么组织
createTime: 2024-10-11
updateTime:
categories: vue
tags: 方法论
series: organize code
description:
---

前两篇文章介绍了在页面、组件内部如何划分代码，都是研究如何“细化”。对于简单的项目，这基本上够用了。

但是在实际工作中，我慢慢感觉到在**大型**且**需求不断迭代**的项目中会遇到些棘手的问题 —— 文件如何组织，即各个组件都应该放在哪里。

## 遇到的麻烦

项目中目录结构通常为：

<pre>
- HelloWorld
    - components
        - 子组件1.vue
        - 子组件2.vue    
    - HelloWorld.vue    
</pre>

### 麻烦一：文件跟着 UI 设计挪来挪去

假设现在页面的 header 中有一个导出按钮，点击会打开“导出弹窗”。

在开发的时候，会很自然地将“导出弹窗.vue”这个文件放在页面 header 目录下（可能是 header/components/dialog 中）。这么做在普通项目中没有什么问题，但如果是在需求不断迭代的项目中就不太合适了：UI 设计可能会不断调整，可能会出现逻辑完全没变，只是将导出按钮从 header 中移到页面的其他位置的情况。但是这时候 “导出弹窗.vue” 这个文件就要跟着移目录。

或者页面其他位置也多了一个导出按钮，那么 “导出弹窗.vue” 这个文件就要往外层移，放到公共父级的 components 下。

—— 我已经多次体会这种情况了，深感疲惫。仅仅是改了按钮的位置，文件就要挪来挪去，这确实很奇怪。

### 麻烦二：目录层级太深

比如目录结构为：

<pre>
- LeftPanel
    - LeftPanelHeader.vue *
    - LeftPanelMain.vue
- MainPanel.vue
</pre>

现在想要给 LeftPanelHeader.vue 添加一个子组件。并不只是多一个文件，而会目录层级也会变深：

<pre>
- LeftPanel
    - LeftPanelHeader（新的一层）
        - LeftPanelHeader.vue
        - components（新的一层）
            - 新加的子组件.vue
    - LeftPanelMain.vue
- MainPanel.vue
</pre>

这样做本身是合理的。但是在大型项目中，目录层级会越套越深。而过深的目录层级会导致代码可读性、可维护性降低。

## 如何应对

在上一篇文章中提到，组件是按照“UI 设计图中的这一块、那一块”划分的。—— 这没问题。

不仅如此，上面提到的，会引起麻烦的**组件组织方式**也是由“UI 设计图”决定的，即这个组件出现在 UI 中的哪一块，就放在哪一块的目录下。—— 但这样做是不对的。

### 不强相关，放顶层

以上面导出按钮的例子来说，在创建文件前就应该考虑：虽然这个导出按钮**此时**存在于页面 UI 的 header 部分，但导出功能仅属于 header 吗？它是否可以出现在页面其它地方？很容易就能得出答案：它不是仅属于 header，在页面的任一位置都可能调用。所以应该在一开始就把 导出弹窗.vue 这个文件放在页面根目录下的 components 里。

最终的理想效果是，项目（或模块）根目录的 components 目录下平铺着很多组件，根目录的 views 目录中只存放和局部 UI 设计强关联的内容（当然在实际的项目中，并不是所有情况都像导出按钮这个例子一样好判断。而且随着需求变化，也可能需要挪位置）。

### 强相关，应该就近放

有时候，要创建的组件就是和其父组件强相关，它不可能在别处使用，这种情况确实应该老老实实就近放置。在简单项目中，子组件放在父组件的 components 目录中，这完全没问题。但是对于有“目录层级过深”隐患的大型项目，应该怎么办呢？

提供三种解决方案：

1. 考虑平铺
2. render function（jsx）
3. 一个文件中包含多个组件

#### 考虑平铺

<pre>
- LeftPanel
    - LeftPanelHeader.vue
    - LeftPanelHeader新加的子组件.vue
    - LeftPanelMain.vue
- MainPanel.vue
</pre>

#### render function

有时，我们并不是真的想创建新组件，而是**不得已而为之**。比如说：

- 单个组件内的功能越来越复杂。script 已经使用 composition-api 拆成多个部分了，但是视图部分还是堆在一起，行数非常多，难读、难改。**单纯为了拆分组件内 template，减少每块 template 的行数**，而将一个组件拆分成多个组件
- 组件内部有一些局部的 html 结构重复出现，这些 html 结构不值当拆分成一个新组件，但是 **为了“局部复用这段 html 代码”** 而不得不将这部分拆出来变成一个新组件。

  ```html
  <div v-if="type === '1'">
    <div>类型1</div>
    <div>一段复杂的 html 结构</div>
  </div>
  <div v-else>
    <div>
      类型2
      <div>
        其他内容
        <div>一段复杂的 html 结构</div>
      </div>
    </div>
  </div>
  ```

从根源上考虑，这些情况我只是想拆分组件内的 template 部分，并不是真的想创建新组件。但因为一个 vue 组件中只能有一个 template，所以不得不创建新组件。—— 但其实这种说法是**错误**的！

习惯了在 SFC 的 template 标签中写视图代码，template 标签中可以直接用类似 html 的语法，IDE 提供很友好的语法高亮、自动补全等支持，很好写。—— 但代价是灵活性低，组件内的 template 无法再拆分（幻想时间：如果 SFC 支持 child template 就可以解决这个烦恼了）

但是只要使用 vue 组件最底层的视图 API —— [render function](https://cn.vuejs.org/guide/extras/render-function)（template 最终也是转换成 render function），就可以实现组件内拆分 template 了！

```js
setup(props) {
  return function () {
    const complexHtmlBlock = h("div", { style: { color: "red" } }, "一段复杂的 html 结构");
    if (props.type === "1") {
      return h("div", [h("div", ["类型1"]), complexHtmlBlock]);
    } else {
      return h("div", [h("div", ["类型2", h("div", ["其他内容", complexHtmlBlock])])]);
    }
  };
},
```

render function 非常灵活，完美应对上面提到的情况！但也确实难写、难读。
为了增强可读性，可以在 render function 中使用 jsx 语法。当然这会牺牲一定灵活性，比如根据 prop 决定元素使用 h1~h6 标签，这只有 render function 可以实现，jsx 做不到。但 jsx 还是比 template 灵活太多了。render function 中 h 和 jsx 可以混着写（使用 jsx 需要额外配置让 build tools、IDE、eslint 等都能正确识别、处理它）

```jsx
  setup(props) {
    const count = ref(0);
    function increment() {
      count.value++;
    }
    return function () {
      const complexHtmlBlock = (
        <div style={{ color: "red" }}>
          一段复杂的 html 结构
          <p>{count.value}</p>
          <input type="button" value="++" onClick={increment} />
        </div>
      );
      if (props.type === "1") {
        return (
          <div>
            <div>类型1</div>
            {complexHtmlBlock}
          </div>
        );
      } else {
        return (
          <div>
            类型2
            <div>
              其他内容
              <div>{complexHtmlBlock}</div>
            </div>
          </div>
        );
      }
    };
  },
```

#### 一个文件包含多个 component

有的时候确实需要子组件，但子组件功能比较简单，不想创建新文件（想要减少文件数量、和目录层级的深度）。这种情况下，可以在一个文件中包含多个 component。

我以前习惯了 SFC，受限于单文件组件的 “单” 这个字眼，“每个文件只放一个组件”已经成了思维惯性了。但其实组件本质上就是一个特殊的对象（object），如果是普通 js 文件中，我一个文件想放几个组件就放几个组件，这是很正常的事。—— 同理，其实在单文件组件里，你也可以想放几个组件就放几个组件。

```html
<script lang="jsx">
  import { ref } from "vue";
  const counterComponent = {
    setup() {
      const count = ref(0);
      function increment() {
        count.value++;
      }
      return function () {
        return (
          <div style={{ color: "red" }}>
            一段复杂的 html
            <p>{count.value}</p>
            <input type="button" value="++" onClick={increment} />
          </div>
        );
      };
    },
  };
  export default {
    components: { counterComponent },
    props: {
      type: { type: String, default: "1" },
    },
    setup(props) {
      return function () {
        if (props.type === "1") {
          return (
            <div>
              <div>类型1</div>
              <counterComponent />
            </div>
          );
        } else if (props.type === "2") {
          return (
            <div>
              类型2
              <div>
                其他内容
                <counterComponent />
              </div>
            </div>
          );
        }
      };
    },
  };
</script>
```

## 总结

### 常规的文件组织方式不适合**大型**且**需求不断迭代**的项目

通常项目中的组件存放在哪里是由**视图**决定的，即它出现在 UI 设计图的哪个部分，就放在哪个目录下。这在简单的项目中没什么问题。

<pre>
- LeftPanel
    - LeftPanelHeader
        - LeftPanelHeader.vue
        - components
            - 子组件1.vue
            - 子组件2.vue
    - LeftPanelMain.vue
- MainContent.vue
- RightPanel.vue
</pre>

但是在**大型**且**需求不断迭代**的项目中，这样就会带来很多麻烦：文件跟着 UI 设计挪来挪去，目录层级太深，开发难度 up up！

### 应对办法

中心思想：

- 不要死板地按照 UI 设计图去放文件（因为 UI 很可能调整）
- 控制文件数量和目录层级。

办法：创建新组件前，先思考 新组件的功能和它所在的这一块 UI 关联性强不强

- 关联不强，放到根目录（就不会出现挪来挪去的问题）
- 关联强，还是就近放。但是要控制文件数量和目录层级。
  - 适当平铺（组件+1，文件+1，目录层级不变）
  - render function（组件、文件、目录层级都不变）（适用于并不真的想创建组件，只想拆 tempalte 的情况）
  - 一个组件内放多个子组件（组件+1，文件数量不变，目录层级不变）

## 反思

一切理念、设计模式都是**为了更好地维护代码**的，所以不要教条地遵守。要去思考它这样规定的初衷是什么，是否符合项目的实际情况。

如果不符合项目的实际情况，要敢于去调整。
