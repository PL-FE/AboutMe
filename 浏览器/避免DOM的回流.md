回流
元素位置发生变化，需要重新排布和渲染

避免DOM的回流
1. 放弃传统的操作dom，基于vue/react数据影响视图模式
mvvp/mvc/虚拟dom/dom diff…[尽可能的避免的重绘和回流]

2. 分离读写模式
浏览器都有批量渲染机制：如果有连续修改样式的内容，浏览器会有渲染队列机制，先统一加载到队列之中，然后进行统一的渲染；

```js
box.style.width = '200px'
console.log(box.style.width)
box.style.height = '200px'
```

**分离读写：**将操作样式和读取样式分开来写，利用浏览器的队列渲染机制【图中:console.log（）放在中间问题很大】

4. 样式集中改变
box.style.cssText=“width:200px；height:200px”//统一修改样式

5. 缓存布局信息
   
```js
let a = box.clienrWidth
box.style.width = a + 10 + 'px'
```

box.clienrWidth是读取操作，如果放在a/b的位置会使回流的次数增加【图中的为优化之后的操作】

文档碎片容器：

字符串拼接也会减少回流
一次性加载

6.动画效果应用到position属性为absolute或者fixed元素上（脱离文档流）
脱离文档流之后，对其它的元素影响小，从而提升性能
7.css中用transform\opacity\filters这些属性会触发硬件加速，不会引发回流和重绘
缺点：过多占用内存，性能消耗严重，导致字体模糊等
【能用transform的就不要用其他的】

8.牺牲平滑度换取速度

减少对象的变化次数（减少回流）
一次性多改变一点

9.避免table布局和使用css的javascript表达式

文章地址：https://blog.csdn.net/zhhvera/article/details/106771247