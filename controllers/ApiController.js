// 提供api
import Controller from "./Controller"

class ApiController extends Controller {
    constructor() {
        super()
    }
    actionDataList(ctx) {
        ctx.body = [
            {
                id: 1,
                data: '1'
            },
            {
                id: 2,
                data: '2'
            },
            {
                id: 3,
                data: '3'
            }
        ]
    }
}

export default ApiController