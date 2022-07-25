# 改变this
call\bind\apply 都是用来改变`this` 指向的



`call` 与 `apply` 

区别：入参形式不同，一般用`call`就好，除非使用到数组就可以直接使用`apply`

共同点：立即执行

```js
fn.call(thisArg, arg1, arg2, arg3, ...)
fn.apply(thisArg, [argsAr])
```

`bind` 与 `call与apply` 

区别：不是立即执行，会返回一个改变了this指针的函数
```js
const fun = fn.bind(thisArg, arg1, arg2, arg3)
fun(arg4, arg5)
```
由于主要学习其中原理，所以为了方便理解，会使用到 ES6 语法
## call

 **立即执行，返回执行结果**

 ```js

Function.prototype.call = function(ctx,...args){
    ctx = ctx || window // 判断是否有参数 如果没有 赋予全局作用域

    const fn = Symbol() // 设置唯一的key

    ctx[fn] = this // this是Function 的实例对象即是调用者本身

    const result = ctx[fn](...args) // 缓存结果，需要返回
     
    delete ctx[fn]
     
    return result
}
```
调用
```js
function func(){
    console.log(this.name)
}
const a ={
    name : 'dudu'
}

func.call(a)//this指向对象 a,输出 dudu
 ```

 ## apply 
 与`call`的差别是参数,`apply` 只有2个入参

  ```js

Function.prototype.apply = function(ctx, data){ // 入参区别-----------
    ctx = ctx || window // 判断是否有参数 如果没有 赋予全局作用域

    const fn = Symbol() // 设置唯一的key

    ctx[fn] = this // this是Function 的实例对象即是调用者本身

    const result = ctx[fn](...data) // 缓存结果，需要返回
     
    delete ctx[fn]
     
    return result
}

```
调用
```js
function func(a,b){
    console.log(this.name,a,b)
}
const a ={
    name : 'dudu'
}

func.apply(a,[1,2])//this指向对象 a,输出 dudu 1 2
 ```

 可以看到，apply 与 call 只有入参的区别

> call() 方法分别接受参数。 
> 
> apply() 方法接受数组形式的参数。
> 
> 如果要使用数组而不是参数列表，则 apply() 方法非常方便。

## bind

**返回一个非立即执行函数**

```js
Function.prototype.bind = function(ctx, ...data){
    ctx = ctx || window // 判断是否有参数 如果没有 赋予全局作用域

    const that = this

    return function (..._data) {
        return that.call(ctx, ...data,..._data)
    }
}


```
调用
```js
function func(a,b,c){
    console.log(this.name,a,b,c)
}
const a ={
    name : 'dudu'
}

const aa = func.bind(a,1,2)// this指向对象 a,输出 dudu 1 
console.log(aa(3)) // dudu 1 2
```
