class ErrorHandler {
    static error(app, logger) {
        app.use(async (ctx, next) => {
            try {
                await next()
                if(ctx.status === 404) {
                    ctx.body = '404'
                }
            } catch(err) {
                logger.error(err.message)
                console.log(err.message);
                ctx.body = '500，正在积极修复'
            }
        })
    }
}

export default ErrorHandler