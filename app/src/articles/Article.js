import Joi from 'joi'
import Bookshelf from '../db'

export const schema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
})

const Article = Bookshelf.Model.extend({
  tableName: 'articles',
  schema: {
    create: schema.keys({ created_at: Joi.date().required() }),
    update: schema,
  },
})

export default Article
