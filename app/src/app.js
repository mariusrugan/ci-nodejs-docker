import manifest from '../package.json'

import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import PrettyError from 'pretty-error'

import articles from './articles/routes'

if (process.env.NODE_ENV !== 'production') PrettyError.start()

const home = new Router()
home.get('/', async ctx => {
  ctx.body = `🔥🔥🔥 api up! let's hack! ${manifest.version} 🔥🔥🔥 \n
  ${Array(12).join('👾')}`
})

const app = new Koa()
  .use(bodyParser())
  .use(home.routes())
  .use(articles.routes())

export default app
