import knex from 'knex'
import bookshelf from 'bookshelf'

import config from './config'

var Bookshelf = bookshelf(knex(config))

class Article extends Bookshelf.Model {
  get tableName() {
    return 'articles'
  }
}

export default Article
