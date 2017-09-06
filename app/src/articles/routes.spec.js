import { getArticles } from './routes'
import * as Article from './Article'

describe('Articles routes', () => {
  it('getArticles should fetchAll', async () => {
    Article.default.fetchAll = jest.fn(() => [])

    let ctx = {}
    await getArticles(ctx)
    expect(ctx.body).toEqual([])
    expect(Article.default.fetchAll).toBeCalled()
  })
})
