import Koa from 'koa'
import render from 'koa-swig'
import co from 'co'
import staticServer from 'koa-static'
import {historyApiFallback} from 'koa2-connect-history-api-fallback'
import log4js from "log4js"

import config from './config'
import initController from './controllers'
import ErrorHandler from './midlleware/ErrorHandle'

const app = new Koa()

// 日志处理
log4js.configure({
    appenders: { 
        globalError: { 
            type: "file", 
            filename: "./logs/error.log" 
        } 
    },
    categories: { 
        default: { 
            appenders: ["globalError"],
            // 日志级别：ALL，TRACE，DEBUG，INFO，WARN，ERROR，FATAL，MARK，OFF 
            level: "error" 
        } 
    }
});
const logger = log4js.getLogger('globalError');
logger.debug("Some debug messages");

// 真假路由问题
// 若匹配不到路由重定向到index
app.use(historyApiFallback({
    index: '/',
    whiteList: ['/api', '/books']
}))

ErrorHandler.error(app, logger)

// 静态资源
app.use(staticServer(config.staticDir))

// 配置swig参数
app.context.render = co.wrap(render({
    // 模版路径
    root: config.viewDir,
    // 线上开启
    cache: config.cache, // disable, set to false
    // 解决和vue模版冲突
    varControls: ['[[', ']]'],
    // 必须
    writeBody: false
}))

// 初始化路由
initController(app)

app.listen(config.port, () => {
    console.log('server is running at port ' + config.port);
})
