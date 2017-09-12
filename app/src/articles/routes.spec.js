jest.mock('./Article', () => ({
  schema: {},
  fetchAll: jest.fn(() => []),
  forge: jest.fn(obj => ({ save: () => obj })),
  where: jest.fn(() => ({ fetch: () => ({ article: 'article' }) }))
}))

import Article from './Article'

import {
  getArticles,
  getArticle,
  updateArticle,
  removeArticle,
  createArticle
} from './routes'

describe('Articles route', () => {
  it('getArticles should fetchAll', async () => {
    let ctx = {}
    await getArticles(ctx)
    expect(ctx.body).toEqual([])
    expect(Article.fetchAll).toBeCalled()
  })

  it('getArticle should fetch by id', async () => {
    let ctx = { params: { id: 1 } }
    await getArticle(ctx)
    expect(ctx.body).toEqual({ article: 'article' })
    expect(Article.where).toBeCalledWith({ id: ctx.params.id })
  })

  it('updateArticle should call save with correct article props', async () => {
    let save = jest.fn(obj => Object.assign({ id: 1 }, obj))
    let ctx = {
      request: { body: { title: 'title', description: 'description' } },
      body: { save }
    }
    await updateArticle(ctx)
    expect(ctx.body).toEqual(Object.assign({ id: 1 }, ctx.request.body))

    expect(save).toBeCalledWith({
      title: 'title',
      description: 'description'
    })
  })

  it('removeArticle should destroy article', async () => {
    let destroy = jest.fn(obj => Object.assign({ id: 1 }, obj))
    let ctx = {
      body: { destroy }
    }
    await removeArticle(ctx)
    expect(destroy).toBeCalled()
  })

  it('createArticle should save article', async () => {
    let ctx = {
      request: { body: {} }
    }
    await createArticle(ctx)
    let info = Object.assign(ctx.request.body, { created_at: Date.now() })
    expect(Article.forge).toBeCalledWith(info)
    expect(ctx.body).toEqual(info)
  })
})
