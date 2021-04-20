class ErrorHandler {
    static error(app) {
        app.use(async (ctx, next) => {
            try {
                await next()
                if(ctx.status === 404) {
                    ctx.body = '404页面'
                }
            } catch {
                ctx.body = '500，正在积极修复'
            }
        })
    }
}

module.exports = ErrorHandler