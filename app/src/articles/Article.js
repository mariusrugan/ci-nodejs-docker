import Bookshelf from '../db'

class Article extends Bookshelf.Model {
  get tableName() {
    return 'articles'
  }
}

export default Article