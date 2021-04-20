import axios from 'axios'

class BooksModel {
    getBooksList() {
        return axios.get('http://localhost/basic/web/index.php?r=books')
    }
    findBook() {
    }
}

export default BooksModel