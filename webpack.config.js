const {argv} = require('yargs')
const {merge} = require('webpack-merge')
// 文件匹配
const glob = require('glob')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
                chunks: [entryKey]
            })
        )
    }
})

const basicConfig = {
    mode,
    // 多入口
    entry: entries,
    output: {
        path: path.join(__dirname, './dist/assets'),
        // name是entries中的key
        filename: 'scripts/[name].bundle.js'
    },
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
        ...htmlPlugins
    ]
}

module.exports = merge(basicConfig, envConfig)