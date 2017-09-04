import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'

import Article from '../db'

const router = new Router()
router.get('/', async ctx => {
  ctx.body = await Article.fetchAll()
})

const app = new Koa()
  .use(bodyParser())
  .use(router.routes())

let port = process.env.PORT || 8080
app.listen(port, () => {
  console.info(`Running application on port ${port}`) //eslint-disable-line
})