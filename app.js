const Koa = require('koa')
const render = require('koa-swig')
const co = require('co')
const static = require('koa-static')
const {historyApiFallback} = require('koa2-connect-history-api-fallback')

const config = require('./config')
const initController = require('./controllers')

const app = new Koa()

// 真假路由问题
// 若匹配不到路由重定向到index
app.use(historyApiFallback({
    index: '/',
    whiteList: ['/api']
}))

// 静态资源
app.use(static(config.staticDir))

// 配置swig参数
app.context.render = co.wrap(render({
    // 模版路径
    root: config.viewDir,
    // 线上开启
    cache: config.cache, // disable, set to false
}))

initController(app)

app.use(ctx => {
    ctx.body = 'hello koa'
})

app.listen(config.port, () => {
    console.log('server is running at port ' + config.port);
})
