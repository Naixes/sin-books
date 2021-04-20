const Controller = require("./Controller");

class IndexController extends Controller {
    constructor() {
        super()
    }
    async actionIndex(ctx) {
        // context
        await ctx.render('index', {message: 'swig message'})
    }
}

module.exports = IndexController