import BooksModel from "../models/BookModel"
import Controller from "./Controller"

class BooksController extends Controller {
    constructor() {
        super()
    }
    async actionBooksListPage(ctx) {
        const booksModel = new BooksModel()
        const result = await booksModel.getBooksList()
        // context
        ctx.body = await ctx.render('books/list', {
            data: result.data
        })
    }
}

export default BooksController