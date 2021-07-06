const HtmlWebpackPlugin = require("html-webpack-plugin");

const pluginName = 'HtmlAfterPlugin';

// 生成script标签
const assetHelp = (data) => {
  let js = []
  for(let item of data.js) {
    // 给业务js添加标识lazyload-js，白名单 runtime
    // const whiteList = []
    js.push(`<script class="lazyload-js" src=${item}></script>`)
    // 继续优化的话可以做js缓存
    // 写一个actitvejs，从缓存中获取localStorage，前端执行
    // function activeJs(item) {}
    // 已经缓存了js的情况下直接执行就可以了
    // activeJs(item)
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