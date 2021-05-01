// 文件拷贝
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
    output: {
        path: path.join(__dirname, '../dist/assets'),
        // name是entries中的key
        filename: 'scripts/[name].bundle.js'
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, '../src/web/views/layouts'),
                    to: '../views/layouts'
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
                    }
                },
            ]
        })
    ],
}