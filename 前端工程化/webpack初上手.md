## 初体验

简单实现如下功能

- es6 转 es5
- 资源复制
- 公共模块抽取

### 安装命令

webpack 启动的依赖

```bash
npm i -D webpack webpack-cli
```

webpack 转义

```bash
npm i -D  @babel/core @babel/preset-env babel-loader
```

### 创建配置文件

编写转义规则文件 .babelrc

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": ["last 2 versions", "not ie <= 9"]
        }
      }
    ]
  ]
}
```

新建 webpack 配置文件 `webpack.config.js`

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 为 html 引入 js
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 构建时清除文件
const CopyWebpackPlugin = require('copy-webpack-plugin') // 复制资源

module.exports = {
  mode: 'production',
  entry: {
    commom: './lib/axios.js', // a 和 b 文件都引用了 axios
    a: './a.js',
    b: './b.js',
  },
  output: {
    filename: '[name].[chunkhash].js', // 输出文件名，后面接上16位hash
    path: path.resolve(__dirname, 'dist'), // 输出的文件夹
  },
  module: {
    // 本次的目的，进行babel的转换
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './package.json',
          to: path.resolve(__dirname, 'dist/package.json'),
        },
      ],
    }),
  ],
  // 抽取出公共引用的模块
  optimization: {
    splitChunks: {
      //分割代码块，如果只有一个入口，就不需要分割了，只有多页，才需要把公共的抽离出来
      cacheGroups: {
        //缓存组
        common: {
          //公共的模块
          chunks: 'initial', //刚开始就要抽离
          minSize: 0, //大小大于0字节的时候需要抽离出来
          minChunks: 2, //重复2次使用的时候需要抽离出来
        },
      },
    },
  },
}
```
