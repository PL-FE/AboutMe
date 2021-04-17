<!-- Nginx 为什么能解决跨域问题
讲到这里，Nginx 为什么能解决跨域问题，也就很容易理解了。

跨域问题的本质，是浏览器不允许跨域，具体来说是浏览器如果发现一个网址在向另一个网址发送 Ajax 请求，或者向一个网址相同、端口号不同的地址发送 Ajax 请求，那么浏览器会禁止这种请求。

沿用 Steam 的比喻，有一个家长，规定小孩最多只能玩一款游戏，如果家长发现小孩玩了两款不同的游戏，视为“跨域玩游戏”，会进行禁止。

然而浏览器和家长，都是很容易糊弄的。我只要让家长以为两款游戏是同一款游戏。我可以告诉家长，我正在玩一款叫做 Steam 的游戏，我只玩这一款游戏，别的都不玩。家长以为 Steam 只是一款游戏，于是允许我玩。

浏览器也是同理，我只要让浏览器误以为我跨域的两个网址/端口号，并不是两个，而是同一个，它就不会认为我跨域了。我告诉浏览器，我现在的端口号是 Nginx 所监听的端口号 8080，而我要 Ajax 请求的端口号也是 Nginx 所监听的端口号 8080，两个网址和端口号是一样的，浏览器认为我两个服务都是同一个服务器，于是允许我发送 Ajax 请求。 -->

跨域是因为 [浏览器的同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy) 在搞事情。

# 同源策略

## 含义

**同源是指"协议+域名+端口"三者相同**

| URL                                               | 结果 | 原因                                |
| ------------------------------------------------- | ---- | ----------------------------------- |
| `http://store.company.com/dir2/other.html`        | 同源 | 只有路径不同                        |
| `http://store.company.com/dir/inner/another.html` | 同源 | 只有路径不同                        |
| `https://store.company.com/secure.html`           | 失败 | 协议不同                            |
| `http://store.company.com:81/dir/etc.html`        | 失败 | 端口不同 ( `http://` 默认端口是 80) |
| `http://news.company.com/dir/other.html`          | 失败 | 主机不同                            |

## 目的

同源政策的目的，是为了保证用户信息的安全，防止恶意的网站窃取数据。

设想这样一种情况：A 网站是一家银行，用户登录以后，又去浏览其他网站。如果其他网站可以读取 A 网站的 Cookie，会发生什么？

很显然，如果 Cookie 包含隐私（比如存款总额），这些信息就会泄漏。更可怕的是，Cookie 往往用来保存用户的登录状态，如果用户没有退出登录，其他网站就可以冒充用户，为所欲为。因为浏览器同时还规定，提交表单不受同源政策的限制。

由此可见，"同源政策"是必需的，否则 Cookie 可以共享，互联网就毫无安全可言了。

### 解决方案

##### 1. JSONP

较早的时候是使用 `JSONP` 来跨域，在我还没接触前端的时候 😜

`JSONP`也叫填充式 JSON，是应用 JSON 的一种新方法，只不过是被包含在函数调用中的 JSON

基本原理是 **利用\<script>标签没有跨域限制的“漏洞”**。

```
 <script>
    var script = document.createElement('script');
    script.type = 'text/javascript';

    // 传参一个回调函数名给后端，方便后端返回时执行这个在前端定义的回调函数
    script.src = 'http://www.domain2.com:8080/login?user=admin&callback=handleCallback';
    document.head.appendChild(script);

    // 回调执行函数
    function handleCallback(res) {
        alert(JSON.stringify(res));
    }
 </script>
```

服务端返回如下（返回时即执行全局函数）：

```
handleCallback({"status": true, "user": "admin"})
```

**JSONP 的优缺点**

**优点**

- 跨域同源策略
- 兼容性更好，在更加古老的浏览器中也可以运行
- JSONP 提供的纯数据，可以实现复用

缺点

- 只支持 `GET`

- 失败不会返回 `HTTP` 状态码
- 安全性。返回的 JavaScript 内容被人控制，会导致所有调用这个 JSONP 的网站都存在漏洞

##### 2. **postMessage**

`postMessage` 是 html5 引入的 API，`postMessage()`方法允许来自不同源的脚本采用异步方式进行有效的通信,可以实现跨文本文档,多窗口,跨域消息传递.多用于窗口间数据通信,这也使它成为跨域通信的一种有效的解决方案。

postMessage(data,origin) 方法接受两个参数：

（1）**data**: 要传递的数据

（2）**origin**：字符串参数，指明目标窗口的源，协议+主机+端口号[+URL]，URL 会被忽略，所以可以不写，这个参数是为了安全考虑，postMessage () 方法只会将 message 传递给指定窗口，当然如果愿意也可以建参数设置为"\*"，这样可以传递给任意窗口，如果要指定和当前窗口同源的话设置为"/"；

```html
<!-- index.html -->
<iframe src="http://127.0.0.1:5500/frame1.html" frameborder="1"></iframe>
<iframe src="http://127.0.0.1:5500/frame2.html" frameborder="1"></iframe>
<script>
  // 等待信息的到来
  window.addEventListener(
    'message',
    function (e) {
      console.log(e.data)
    },
    false
  )
</script>
```

```html
<!-- frame1.html -->
<h1>iframe1 page</h1>
<script>
  // 发送信息
  window.top.postMessage('message from iframe1')
</script>
```

##### 3. **CORS**

参考[阮一峰-跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)

CORS 需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE 浏览器不能低于`IE10`。

整个 CORS 通信过程，都是浏览器自动完成，不需要用户参与。对于开发者来说，CORS 通信与同源的 AJAX 通信没有差别，代码完全一样。浏览器一旦发现 AJAX 请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。

因此，实现 CORS 通信的关键是服务器。只要服务器实现了 CORS 接口，就可以跨源通信。

浏览器将 CORS 请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。

只要同时满足以下两大条件，就属于简单请求。

> （1) 请求方法是以下三种方法之一：
>
> - HEAD
> - GET
> - POST
>
> （2）HTTP 的头信息不超出以下几种字段：
>
> - Accept
> - Accept-Language
> - Content-Language
> - Last-Event-ID
> - Content-Type：只限于三个值`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`

对于**简单请求**，浏览器直接发出 CORS 请求。具体来说，就是在头信息之中，增加一个`Origin`字段。

前端什么也不用干，就是正常发请求就可以，如果需要带 cookie 的话，前后端都要设置一下。

CORS 请求默认不发送 Cookie 和 HTTP 认证信息。如果要把 Cookie 发到服务器，一方面要服务器同意，指定`Access-Control-Allow-Credentials`字段。

> ```http
> Access-Control-Allow-Credentials: true
> ```

另一方面，开发者必须在 AJAX 请求中打开`withCredentials`属性。

> ```javascript
> var xhr = new XMLHttpRequest()
> xhr.withCredentials = true
> ```

否则，即使服务器同意发送 Cookie，浏览器也不会发送。或者，服务器要求设置 Cookie，浏览器也不会处理。

需要注意的是，如果要发送 Cookie，`Access-Control-Allow-Origin`就不能设为星号，必须指定明确的、与请求网页一致的域名。同时，Cookie 依然遵循同源政策，只有用服务器域名设置的 Cookie 才会上传，其他域名的 Cookie 并不会上传，且（跨源）原网页代码中的`document.cookie`也无法读取服务器域名下的 Cookie。

**非简单请求**是那种对服务器有特殊要求的请求，比如请求方法是`PUT`或`DELETE`，或者`Content-Type`字段的类型是`application/json`。

非简单请求的 CORS 请求，会在正式通信之前，增加一次 HTTP 查询请求，称为"预检"请求（preflight）。

非简单请求会发出一次预检测请求，返回码是204，预检测通过才会真正发出请求，这才返回200。

![clipboard.png](预检.png)

浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 HTTP 动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的`XMLHttpRequest`请求，否则就报错。

一旦服务器通过了"预检"请求，以后每次浏览器正常的 CORS 请求，就都跟简单请求一样，会有一个`Origin`头信息字段。服务器的回应，也都会有一个`Access-Control-Allow-Origin`头信息字段。

**预检通过之后，浏览器的正常 CORS 请求**

```http
PUT /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
X-Custom-Header: value
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

上面头信息的`Origin`字段是浏览器自动添加的。

下面是**服务器正常的回应**。

```http
Access-Control-Allow-Origin: http://api.bob.com
Content-Type: text/html; charset=utf-8
```

上面头信息中，`Access-Control-Allow-Origin`字段是每次回应都必定包含的。



**优点**

- 在服务端进行控制是否允许跨域，可自定义规则
- 支持各种请求方式

**缺点**

- 会产生额外的请求



CORS 与 JSONP 的使用目的相同，但是比 JSONP 更强大。

JSONP只支持`GET`请求，**CORS 支持所有类型的 HTTP 请求。**

**JSONP 的优势在于支持老式浏览器，以及可以向不支持 CORS 的网站请求数据。**



##### 4.**代理**

想一下，如果我们请求的时候还是用前端的域名，然后有个东西帮我们把这个请求转发到真正的后端域名上，不就避免跨域了吗？

**代理** 也是目前比较流行的解决跨域的方案。如 `webpack-dev-server`、`Nginx`。

比如前端在开发的时候，使用 Vue 的可能比较熟悉

```js
 devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        contentBase: "./app",
        port: 8090,
        proxy: {
            "/api": {
              target: 'http://api.com',
              pathRewrite: {'^/api' : ''},
              changeOrigin: true
            }
        },
        
    }
```

vue 封装了 `webpack-dev-server` ，所以现在可以简单配置，就可以将本地的请求转发到服务器 `http://api.com`。

生产时，一般使用的是`Nginx`

```json
server{
    # 监听9099端口
    listen 9099;
    # 域名是localhost
    server_name localhost;
    #凡是localhost:9099/api这个样子的，都转发到真正的服务端地址http://localhost:9871 
    location ^~ /api {
        proxy_pass http://localhost:9871;
    }    
}
```

Nginx 转发的方式似乎很方便！但这种使用也是看场景的，如果后端接口是一个公共的API，比如一些公共服务获取天气什么的，前端调用的时候总不能让运维去配置一下Nginx，如果兼容性没问题（IE 10或者以上），CROS才是更通用的做法吧。

