import Router from 'koa-router'
import validate from '../http/validate_schema'

import Article, { schema } from './Article'

export async function getArticles(ctx) {
  const articles = await Article.fetchAll()
  ctx.body = articles
}

export async function getArticle(ctx, next) {
  const { id } = ctx.params
  let article = await Article.where({ id }).fetch()
  ctx.body = article
  await next()
}

export async function updateArticle(ctx) {
  let article = ctx.body
  const { title, description } = ctx.request.body
  console.log(Date.now())
  ctx.body = await article.save({ title, description, updated_at: Date.now() })
}

export async function createArticle(ctx) {
  let info = Object.assign(ctx.request.body, { created_at: Date.now() })
  let article = Article.forge(info)
  ctx.body = await article.save()
}

export async function removeArticle(ctx) {
  let article = ctx.body
  await article.destroy()
  ctx.body = { info: 'success' }
}

export default new Router({ prefix: '/article:s?' })
  .get('/', getArticles)
  .get('/:id', getArticle)
  .post('/', validate(schema), createArticle)
  .patch('/:id', getArticle, updateArticle)
  .delete('/:id', getArticle, removeArticle)
