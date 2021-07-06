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
            const $ = cheerio.load(html)
            // html
            // 找到需要局部刷新的部分进行bigpipe输出
            $(".pjaxcontent").each(function () {
                ctx.res.write($(this).html())
            })
            // js
            // 无论之前有没有加载过js，切换到这个页面，js都可能会缺失
            // 通过自定义插件给业务js添加的lazyload-js标识找到需要的js进行bigpipe输出
            $(".lazyload-js").each(function () {
                ctx.res.write(`<script src=${$(this).attr('src')}></script>`)
            })
            ctx.res.end()
        }else {
            // 刷新
            // 数据量太大，bigpipe
            // html已经render过一次不能直接创建流
            // const filename = resolve(join(__dirname, 'index.html'))
            // const stream = fs.createReadStream(filename)

            function createSsrStreamPromise() {
                return new Promise((resolve, reject) => {
                    const htmlStream = new Readable()
                    htmlStream.push(html)
                    htmlStream.push(null)

                    htmlStream.on('error', err => {
                        reject(err)
                    }).pipe(ctx.res)
                })
            }
            await createSsrStreamPromise()
            // ctx.body = html
        }
    }
    async actionBooksCreatePage(ctx) {
        ctx.body = await ctx.render('books/pages/create')
    }
}

export default BooksController   