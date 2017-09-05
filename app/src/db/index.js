import knex from 'knex'
import bookshelf from 'bookshelf'

import config from './config'

export const Knex = knex(config)
export default bookshelf(Knex)
