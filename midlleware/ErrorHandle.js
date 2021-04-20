class ErrorHandler {
    static error(app, logger) {
        app.use(async (ctx, next) => {
            try {
                await next()
                if(ctx.status === 404) {
                    ctx.body = '<script type="text/javascript" src="//qzonestyle.gtimg.cn/qzone/hybrid/app/404/search_children.js" charset="utf-8"></script>'
                }
            } catch(err) {
                logger.error(err.message)
                ctx.body = '500，正在积极修复'
            }
        })
    }
}

export default ErrorHandler