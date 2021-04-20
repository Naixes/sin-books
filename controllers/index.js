import Router from '@koa/router'
import IndexController from './IndexController'
import ApiController from './ApiController'

const router = new Router()
const indexController = new IndexController()
const apiController = new ApiController()

function initController(app) {
    // 会自动将ctx，next传过去
    router.get('/', indexController.actionIndex)
    router.get('/api/getBooksList', apiController.actionBooksList)

    app
        .use(router.routes())
        // allowedMethods处理的业务是当所有路由中间件执行完成之后,若ctx.status为空或者404的时候,丰富response对象的header头
        // 如果不设置router.allowedMethods()在表现上除了ctx.status不会自动设置,以及response header中不会加上Allow之外,不会造成其他影响.
        .use(router.allowedMethods())

}

export default initController