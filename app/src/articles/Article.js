import Joi from 'joi'
import Bookshelf from '../db'

const title = Joi.string()
const description = Joi.string()

export const schema = Joi.object().keys({
  title: title.required(),
  description: description.required()
})

const Article = Bookshelf.Model.extend({
  tableName: 'articles',
  schema: {
    create: schema.keys({ created_at: Joi.date().required() }),
    update: schema.keys({
      title,
      description,
      updated_at: Joi.date().required()
    })
  },
  toJSON() {
    var attrs = Bookshelf.Model.prototype.toJSON.apply(this, arguments)
    attrs.created_at = new Date(attrs.created_at)
    if (attrs.updated_at != null) attrs.updated_at = new Date(attrs.updated_at)
    return attrs
  }
})

export default Article
