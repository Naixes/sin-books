// 提供api
import BooksModel from "../models/BookModel"
import Controller from "./Controller"

class ApiController extends Controller {
    constructor() {
        super()
    }
    async actionBooksList(ctx) {
        const booksModel = new BooksModel()
        const result = await booksModel.getBooksList()
        ctx.body = result.data
    }
}

export default ApiController