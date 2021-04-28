# BFF

## 版本1

文件结构

koa

环境区分

开发代码监听nodemon（supervisor较老），线上使用pm2

路由@koa/router

- 初始化
- api路由
- 渲染页面路由，koa-swig+co

静态资源：koa-static

真假路由：koa2-connect-history-api-fallback

容错处理

区分不支持es6的浏览器，用babel编译systmejs加载

> 模版冲突：swig配置项varControls: ['[[', ']]']
>
> npm i @babel/plugin-transform-modules-systemjs @babel/cli @babel/core -D

日志：log4js，日志时间，日志级别（ALL，TRACE，DEBUG，INFO，WARN，ERROR，FATAL，MARK，OFF），日志分类，保存到文件

ES6模块化语法修改，@babel/node+@babel/preset-env，开发环境代码运行之前进行转码或者后缀使用mj，snode12后支持或者package.json添加`"type": "module"`

model层

axios封装，容错

封装函数式库

- 阅读源码：lodash，underscore
- 参考

e2e测试

playWright+chai

rize pupteer

接口测试

mocha+supertest

> 工具：tree-cli，生成文件结构
>
> tree -L 2 -o README.md

## 版本2

### webComponents

YouTube使用

框架：x-tag，polymerjs，omi

### 前后端分离

库：scripty，使用sh文件管理命令

```json
// 修改前：
  "scripts": {
    "dev": "NODE_ENV=development nodemon --exec babel-node ./app.js",
    "build": "babel ./assets/js/testData.js -o ./assets/js/testData-bundle.js",
    "test:e2e": "node tests/e2e.test.js",
    "test:api": "mocha --file ./tests/api.test.js"
  },
// 修改后
  "scripts": {
    "client:dev": "scripty",
    "client:prod": "scripty",
    "server:dev": "scripty",
    "server:prod": "scripty",
    "test:e2e": "scripty",
    "test:api": "scripty",
    "dev": "NODE_ENV=development nodemon --exec babel-node ./app.js",
    "start": "pm2",
    "test": "",
    "build": "npm run client:prod & npm run server:prod",
    "build-systemjs": "babel ./assets/js/testData.js -o ./assets/js/testData-bundle.js"
  },
```

集群编译

钩子：

```json
    "demo": "echo helleo",
    "predemo": "predemo"
```

npm-run-all

jscpd：代码重复率检查

.jscpd.json

```json
{
  "threshold": 0,
  "reporters": ["html", "console"]
}
// 命令：jscpd './demo/test.js'
```

文件夹分离

mpa，服务器渲染多页面

webpack，多入口

```js
// webpack.config.js基本配置
module.exports = {
    entry: "",
    output: "",
    module: ""
}
```

区分打包环境：

库，yargs，处理命令参数

webpack-merge，合并配置文件

glob，多入口文件处理

babel：babel-loader

模版语法不能引入css和js，需要webpack处理

html-webpack-plugin：打包html并注入资源

多页面配置，解决引用多余js文件和js资源注入位置错误，抽离共通的runtime

自定义插件解决js资源注入位置错误

gulp