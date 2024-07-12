---
id: 2f1de934-4d9e-44a8-be6f-339dc20a314c
title: vue computed 使用避坑
createTime: 2021-07-07
updateTime: 2021-07-07
categories: vue
tags: 
description: 
---

其实不是 computed 的坑，是我自己没弄清原理瞎用，导致出现各种问题。。

```html
<template>
  <section>
    <input type="button" value="查看三个list的值" @click="lookOneLook" />
    <div>
      list1：
      <span v-for="(o, index) in list1" :key="'list1' + index"> {{ o }} </span>
    </div>
    <div>
      list2：
      <span v-for="(o, index) in list2" :key="'list2' + index"> {{ o }} </span>
      <input type="button" value="向list2中push" @click="list2.push(5)" />
    </div>
    <div>
      list3：
      <span v-for="(o, index) in list3" :key="'list3' + index"> {{ o }} </span>
      <input type="button" value="向list3中push" @click="list3.push(6)" />
    </div>
  </section>
</template>

<script>
  export default {
    computed: {
      list2: {
        get() {
          return this.list1;
        },
        set(val) {
          alert("触发list2的setter");
          this.list1 = val;
        },
      },
      list3: {
        get() {
          return this.list1.map((o) => o);
        },
        set(val) {
          alert("触发list3的setter");
          this.list1 = val;
        },
      },
    },
    data() {
      return {
        list1: [1, 2, 3, 4],
      };
    },
    methods: {
      lookOneLook() {
        alert(`
      list1 : ${this.list1}
      list2 : ${this.list2}
      list3 : ${this.list3}`);
      },
    },
  };
</script>
```

![在这里插入图片描述](..\post-assets\1551efea-cb84-445e-b8eb-c1c487a398cd.png)

list2.push 和 list3.push 都没有触发的 computed setter。对于引用类型的计算属性，只有 `list2=...` 这样修改引用地址，才会触发 setter

- list2.push()  
  能成功修改三个 list 的值。因为 list2 和 list1 是相同的引用地址，list2.push 此时等价于 list1.push。list1 变化后触发 list3 变化
- list3.push()  
  能成功修改自己，但是数据变化没有触发视图的自动更新。是因为 computed 只是个 Watcher，自身没有绑定依赖，值变化不会触发视图的更新。所以在页面中看不到 list3 变化，只能在弹窗中看到 list3 的变化（因为弹窗是每次点击后当场取值的）
- 又 list2.push
  此时 list3 又变回去了

反思：

- ==对于引用类型的计算属性，只有 list2=... 这样修改引用地址，才会触发 setter==
- 计算属性自己只是个 Watcher，不是像 props 和 data 那样的数据。所以==绝对不要在计算属性上加自定义的属性==，因为没有意义：
  - 1 它不是对象，没有依赖关系。数据变化，"依赖"不会更新
  - 2 computed 内部关联的变量一旦变化，computed 的值就会重新计算，你自己添加的属性的修改就都没了。
- 下面的写法一有效，是因为引用相同，相当于什么都没干就是单纯起了个别名。这种起别名的操作以后少干，因为逻辑上很不清晰，复杂的工程中出了 bug 不好调。
  ````js
  computed:{
  	options:{
  		// 写法一：test() 有效，是因为 this.options 和 this.userObj.options 是相同引用
  		return this.userObj.options;
  		/** 写法二：test() 无效
  		return {
  			name :this.userObj.options.name
  		};*/
  	}
  }
  methods:{
  	test(){
  		this.options.name='1';
  	}
  }```

  ````
- ==**computed 本质就是一个有 value 的 Watcher，别把它当数据用！！！**==