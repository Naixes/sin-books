import BooksModel from "../models/BookModel"
import Controller from "./Controller"

class BooksController extends Controller {
    constructor() {
        super()
    }
    async actionBooksListPage(ctx) {
        const booksModel = new BooksModel()
        const result = await booksModel.getBooksList()
        
        ctx.body = await ctx.render('books/pages/list', {
            data: result.data
        })
    }
}

export default BooksController