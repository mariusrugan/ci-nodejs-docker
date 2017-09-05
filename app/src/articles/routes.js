import Router from 'koa-router'

import Article from './Article'

export async function getArticles(ctx) {
  const articles = await Article.fetchAll()
  ctx.body = articles
}

export async function getArticle(ctx) {
  const {id} = ctx.params
  let article = await Article.where({id}).fetch()
  
  ctx.body = article
}

// export async function updateVenue(ctx) {
//   let venue = ctx.body
//   const {name} = ctx.request.body
//   return Ok(await venue.save({name}), ctx)
// }

export async function createArticle(ctx) {
  let article = new Article(ctx.request.body)
  ctx.body = await article.save()
}

// export async function removeVenue(ctx) {
//   let venue = ctx.body
//   await venue.destroy()
//   return Ok({info: 'success'}, ctx)
// }

export default new Router({ prefix: '/article:s?' })
  .get('/', getArticles)
  .get('/:id', getArticle)
  .post('/', createArticle)
  // .patch('/:id', validate(schema), getVenue, updateVenue)
  // .delete('/:id', getVenue, removeVenue)