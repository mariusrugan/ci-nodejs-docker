import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import PrettyError from 'pretty-error'

import articles from './articles/routes'

if (process.env.NODE_ENV === 'development') PrettyError.start()

const home = new Router()
home.get('/', async ctx => {
  ctx.body = `🔥🔥🔥 api up! let's hack! 🔥🔥🔥 \n      ${Array(12).join('👾')}`;
})

const app = new Koa()
  .use(bodyParser())
  .use(home.routes())
  .use(articles.routes())

let port = process.env.PORT || 8080
app.listen(port, () => {
  console.info(`Running application on port ${port}`) //eslint-disable-line
})
