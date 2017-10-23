jest.mock('./Article', () => ({
  schema: {},
  fetchAll: jest.fn(() => []),
  forge: jest.fn(obj => ({ save: () => obj })),
  where: jest.fn(({ id }) => ({
    fetch: () => (id === 1 ? { article: 'article' } : null)
  }))
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
    let next = jest.fn()

    await getArticle(ctx, next)

    expect(ctx.body).toEqual({ article: 'article' })
    expect(Article.where).toBeCalledWith({ id: ctx.params.id })
    expect(next).toHaveBeenCalled()
  })

  it('getArticle should call next only if an article was found', async () => {
    let ctx = { params: { id: -1 } }
    let next = jest.fn()

    await getArticle(ctx, next)

    expect(ctx.body).toBeNull()
    expect(Article.where).toBeCalledWith({ id: ctx.params.id })
    expect(next).not.toHaveBeenCalled()
  })

  it('updateArticle should call save with correct article props', async () => {
    let updated_at = new Date('2017-11-25T12:34:56z')
    Date.now = jest.genMockFunction().mockReturnValue(updated_at)

    let save = jest.fn(obj => Object.assign({ id: 1 }, obj))
    let ctx = {
      request: { body: { title: 'title', description: 'description' } },
      body: { save }
    }
    await updateArticle(ctx)
    expect(ctx.body).toEqual(
      Object.assign({ id: 1, updated_at }, ctx.request.body)
    )

    expect(save).toBeCalledWith({
      title: 'title',
      description: 'description',
      updated_at
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
