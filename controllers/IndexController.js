import Controller from "./Controller"

class IndexController extends Controller {
    constructor() {
        super()
    }
    async actionIndex(ctx) {
        // context
        await ctx.render('index', {message: 'swig message'})
    }
}

export default IndexController