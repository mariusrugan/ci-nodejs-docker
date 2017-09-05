import Router from 'koa-router'

import Article from './Article'

// import {Ok, NotFound} from '../infrastructure/http/response'
// import validate from '../infrastructure/http/validate'

// import Venue, {schema} from './Venue'

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

// export async function createVenue(ctx) {
//   let venue = new Venue(ctx.request.body)
//   venue = await venue.save()
//   return Ok(venue, ctx)
// }

// export async function removeVenue(ctx) {
//   let venue = ctx.body
//   await venue.destroy()
//   return Ok({info: 'success'}, ctx)
// }

export default new Router({ prefix: '/article:s?' })
  .get('/', getArticles)
  .get('/:id', getArticle)
  // .post('/', validate(schema), createVenue)
  // .patch('/:id', validate(schema), getVenue, updateVenue)
  // .delete('/:id', getVenue, removeVenue)