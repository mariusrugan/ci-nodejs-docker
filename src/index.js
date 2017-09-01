import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'

const router = new Router()
router.get('/', ctx => {
  ctx.body = {hello: 'worlds'}
})

const app = new Koa()
  .use(bodyParser())
  .use(router.routes())

let port = process.env.PORT || 8080
app.listen(port, () => {
  console.info(`Running application on port ${port}`) //eslint-disable-line
})