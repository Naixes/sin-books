import axios from 'axios'
import SafeRequest from '../utils/safeRequest'

class BooksModel {
    getBooksList() {
        return SafeRequest.fetch('/basic/web/index.php?r=books')
    }
    findBook() {
    }
}

export default BooksModel