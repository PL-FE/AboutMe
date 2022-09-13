nextTick 是异步调用函数的

> 原理是两个异步调用会被批处理，按入栈顺序调用。[nextTick,queueWatcher] => flushSeduerQueue
```js
new Vue({
   data:{
    a:1
   },
   mounted(){
    Vue.nextTick(()=>{
        console.log(this.a) // 1，拿到旧的
    })
    this.a = 2 // 因为这里也为异步更新
   }
})
```
下面是操作dom的时候，也就是需要使用nextTick的时候
```js
new Vue({
   data:{
    a:1
   },
   mounted(){
    Vue.nextTick(()=>{
        console.log(this.$refs.xxx.value) // 可以拿到新的
    })
    this.$refs.xxx.value = 2 // 同步代码
   }
})
```

## 内部异步实现

依次向下降级
- Promise.resolve()
- MutationObserver
- setImmediate
- setTimeout