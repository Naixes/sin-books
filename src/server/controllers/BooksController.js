import BooksModel from "../models/BookModel"
import Controller from "./Controller"
// 在node中像jquery一样操作dom
import cheerio from 'cheerio'

class BooksController extends Controller {
    constructor() {
        super()
    }
    async actionBooksListPage(ctx) {
        const booksModel = new BooksModel()
        const result = await booksModel.getBooksList()
        
        const html = await ctx.render('books/pages/list', {
            data: result.data
        })

        // 纠正请求头，否则会报404
        ctx.status = 200
        ctx.type = 'html'

        // 从站内请求，防止资源重新加载
        if(ctx.request.header["x-pjax"]) {
            console.log(111111);
            const $ = cheerio.load(html)
            $(".pjaxcontent").each(function () {
                console.log($(this).html());
                ctx.res.write($(this).html())
            })
            ctx.res.end()
        }else {
            // 刷新
            // 数据量太大，bigpipe
            ctx.body = html
        }
    }
    async actionBooksCreatePage(ctx) {
        ctx.body = await ctx.render('books/pages/create')
    }
}

export default BooksController