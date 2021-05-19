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

```js
const {argv} = require('yargs')
const {merge} = require('webpack-merge')
// 文件匹配
const glob = require('glob')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 页面模板处理
const HtmlAfterPlugin =  require('./build/HtmlAfterPlugin')
// console.log(argv);

const mode = argv.mode || 'development'
const envConfig = require(`./build/webpack.${mode}.js`)
// 返回文件路径的数组
const files = glob.sync('./src/web/views/**/*.entry.js')
const entries = {}

// 多页面注入配置
const htmlPlugins = []

files.forEach(path => {
    if(/([a-zA-Z]+-[a-zA-Z]+)\.entry\.js/.test(path)) {
        const entryKey = RegExp.$1
        entries[entryKey] = path
        const [pagename, template] = entryKey.split('-')
        htmlPlugins.push(
            new HtmlWebpackPlugin({
                // 路径以output路径为准
                // 导出文件路径
                filename: `../views/${pagename}/pages/${template}.html`,
                // 模版路径
                template: `./src/web/views/${pagename}/pages/${template}.html`,
                // 引入的模块
                chunks: [entryKey],
                // 取消注入功能，用自定义插件HtmlWebpackPlugin替代
                inject: false
            })
        )
    }
})

const basicConfig = {
    mode,
    // 多入口
    entry: entries,
    // 压缩
    optimization: {
        // 抽离出公共部分
        runtimeChunk: 'single'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader']
            }
        ]
    },
    plugins: [
        ...htmlPlugins,
        //  注意顺序，HtmlAfterPlugin是基于HtmlWebpackPlugin做的拦截
        new HtmlAfterPlugin()
    ],
    resolve: {
        alias: {
            "@": path.resolve('./src/web')
        }
    }
}

module.exports = merge(basicConfig, envConfig)
```

自定义插件解决js资源注入位置错误

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

const pluginName = 'HtmlAfterPlugin';

// 生成script标签
const assetHelp = (data) => {
  let js = []
  for(let item of data.js) {
    js.push(`<script src=${item}></script>`)
  }
  return {js}
}

class HtmlAfterPlugin {
  constructor() {
    this.jsArr = []
  }
  // compiler：相当于webpack的核心，挂载了很多东西
  apply(compiler) {
    // compilation：每个chunk都会生成一个
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
        // HtmlWebpackPlugin提供的钩子
        HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
          "HtmlAfterPlugin", // <-- Set a meaningful name here for stacktraces
          (data, cb) => {
            // 获取需要替换的js
            const {js} = assetHelp(data.assets)
            this.jsArr = js

            // Tell webpack to move on
            cb(null, data)
          }
        )
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
          "HtmlAfterPlugin", // <-- Set a meaningful name here for stacktraces
          (data, cb) => {
            // 替换<!-- injectjs -->
            let _html = data.html
            _html = _html.replace('<!-- injectjs -->', this.jsArr.join(''))
            // 替换@layouts和@components
            _html = _html.replace(/@layouts/g, '../../layouts')
            _html = _html.replace(/@components/g, '../../../components')

            data.html = _html

            // Tell webpack to move on
            cb(null, data)
          }
        )
    });
  }
}

module.exports = HtmlAfterPlugin;
```

gulp代码打包清洗

> prepack，清洗比较极致

```js
const gulp = require('gulp')
const watch = require('gulp-watch')
const babel = require('gulp-babel')
const plumber = require('gulp-plumber')
const rollup = require('gulp-rollup')
const replace = require('@rollup/plugin-replace')

// 入口
const entry = "./src/server/**/*.js";
const cleanEntry = "./src/server/config/index.js";

// 开发环境
function buildDev() {
    // watch：出错后会马上停止，用gulp-plumber
    return watch(entry,{
        ignoreInitial: false
    }, () => {
        gulp.src(entry)
        .pipe(plumber())
        .pipe(
            babel({
                babelrc: false,
                // 将es6转换为commonjs
                "plugins": ["@babel/plugin-transform-modules-commonjs"]
            })
        )
        // 打包
        .pipe(gulp.dest('dist'))
    })
}

// 生产环境
function buildProd() {
    return gulp.src(entry)
        .pipe(
            babel({
                babelrc: false,
                ignore: [cleanEntry],
                // 将es6转换为commonjs
                "plugins": ["@babel/plugin-transform-modules-commonjs"]
            })
        )
        // 打包
        .pipe(gulp.dest('dist'))
}

// 流清洗
function buildConfig() {
    return gulp.src(entry)
        .pipe(rollup({
            input: cleanEntry,
            // 将es6转换为commonjs
            output: {
                format: 'cjs'
            },
            plugins: [
                // 删除多余配置
                replace({
                    'process.env.NODE_ENV': JSON.stringify('production')
                })
            ]
        }))
        // 打包
        .pipe(gulp.dest('dist'))
}

let build = gulp.series(buildDev)
 
if(process.env.NODE_ENV === 'production') {
    // 默认串行
    build = build.series(buildProd, buildConfig)
}

gulp.task('default', build)
```

## 版本3

### mpa+spa真路由同构

jquery.pjax，代理请求

cheerio，在node中像jquery一样操作dom

awilix