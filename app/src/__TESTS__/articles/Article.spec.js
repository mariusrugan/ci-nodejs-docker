import Bookshelf from '../../db'
import Article from '../../articles/Article'

beforeEach(() => Bookshelf.knex.raw('BEGIN'))
afterEach(() => Bookshelf.knex.raw('ROLLBACK'))

let articleFactory = attrs => ({
  title: 'title',
  description: 'description',
  created_at: Date.now(),
  ...attrs
})

describe('Article', () => {
  describe('#insert', () => {
    it('should save article fine', async () => {
      let info = articleFactory()
      let article = await Article.forge(info).save()
      expect(article.id).toBeGreaterThan(0)
    })

    it('should not be possible insert article without title', () => {
      let info = articleFactory()
      delete info.title
      expect(Article.forge(info).save()).rejects.toBeTruthy()
    })

    it('should not be possible insert article without description', () => {
      let info = articleFactory()
      delete info.description
      expect(Article.forge(info).save()).rejects.toBeTruthy()
    })

    it('should not be possible insert article without created_at', () => {
      let info = articleFactory()
      delete info.created_at
      expect(Article.forge(info).save()).rejects.toBeTruthy()
    })
  })

  describe('#update', () => {
    it('should update fine', async () => {
      let info = articleFactory()
      let article = await Article.forge(info).save()

      await article.save({ title: 'new title', updated_at: new Date() })

      let from_db = await Article.where({ id: article.id }).fetch()
      expect(from_db.toJSON()).toEqual(
        expect.objectContaining({
          updated_at: expect.any(Date),
          title: 'new title'
        })
      )
    })

    it('should not be possible update article without updated_at', async () => {
      let info = articleFactory()
      let article = await Article.forge(info).save()
      expect(article.save({ title: 'new title' })).rejects.toBeTruthy()
    })
  })

  describe('#search', () => {
    it('by id should return article', async () => {
      let article = await Article.forge(articleFactory()).save()

      var from_db = await Article.where({ id: article.id }).fetch()
      expect(from_db.toJSON()).toEqual(
        expect.objectContaining({
          created_at: expect.any(Date),
          id: expect.any(Number),
          updated_at: null
        })
      )
    })
  })

  describe('#delete', () => {
    it('should destroy', async () => {
      let article = await Article.forge(articleFactory()).save()
      const id = article.toJSON().id
      await article.destroy()
      var from_db = await Article.where({ id }).fetch()
      expect(from_db).toBeNull()
    })
  })
})
