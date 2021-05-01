// 文件拷贝
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const minify = require('html-minifier').minify

module.exports = {
    output: {
        path: path.join(__dirname, '../dist/assets'),
        // name是entries中的key
        // hash缓存
        filename: 'scripts/[name].[contenhash:8].bundle.js'
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, '../src/web/views/layouts'),
                    to: '../views/layouts',
                    // 压缩
                    transform(content, absoluteForm) {
                        return minify(content.toString('utf-8'))
                    }
                },
                {
                    from: path.join(__dirname, '../src/web/components'),
                    to: '../components',
                    // 过滤js和css
                    filter: url => {
                        if(/\.js|css$/.test(url)) {
                            return false
                        }else {
                            return true
                        }
                    },
                    // 压缩
                    transform(content, absoluteForm) {
                        return minify(content.toString('utf-8'))
                    }
                },
            ]
        })
    ],
}