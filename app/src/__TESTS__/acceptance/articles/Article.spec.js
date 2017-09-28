import Bookshelf from '../../../db'
import Article from '../../../articles/Article'

import app from '../../../app'
import supertest from 'supertest'

beforeEach(() =>
  Bookshelf.knex.raw('TRUNCATE TABLE articles RESTART IDENTITY;')
)

let articleFactory = attrs => ({
  title: 'title',
  description: 'description',
  created_at: Date.now(),
  ...attrs
})

describe('articles api', () => {
  const request = supertest.agent(app.listen())

  it('GET /articles', async () => {
    await Article.forge(
      articleFactory({ created_at: new Date('2017-11-25T12:34:56z') })
    ).save()

    let res = await request.get('/articles')
    expect(res.status).toBe(200)
    expect(res.body).toMatchSnapshot()
  })

  it('GET /articles/{id}', async () => {
    var article = await Article.forge(
      articleFactory({ created_at: new Date('2017-11-25T12:34:56z') })
    ).save()

    let res = await request.get(`/articles/${article.toJSON().id}`)
    expect(res.status).toBe(200)
    expect(res.body).toMatchSnapshot()
  })

  it('POST /articles', async () => {
    let res = await request
      .post('/article')
      .send({ title: 'article title', description: 'article desc' })
    Date.now = jest
      .genMockFunction()
      .mockReturnValue(new Date('2017-11-25T12:34:56z'))

    expect(res.status).toBe(200)
    expect(res.body).toMatchSnapshot()
    jest.resetAllMocks()
  })

  it('PATCH /articles/{id}', async () => {
    var article = await Article.forge(
      articleFactory({ created_at: new Date('2017-11-25T12:34:56z') })
    ).save()
    Date.now = jest
      .genMockFunction()
      .mockReturnValue(new Date('2017-11-25T12:34:56z'))

    let body = article.toJSON()
    body.title = 'new title'
    let res = await request.patch(`/articles/${body.id}`).send(body)
    expect(res.status).toBe(200)
    expect(res.body).toMatchSnapshot()
    jest.resetAllMocks()
  })

  it('DELETE /articles/{id}', async () => {
    var article = await Article.forge(
      articleFactory({ created_at: new Date('2017-11-25T12:34:56z') })
    ).save()

    let body = article.toJSON()
    body.title = 'new title'
    let res = await request.delete(`/articles/${body.id}`)
    expect(res.status).toBe(200)
    expect(res.body).toMatchSnapshot()
  })
})
