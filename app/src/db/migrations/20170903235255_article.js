exports.up = knex => {
  return knex.schema.createTable('articles', t => {
    t.increments('id').primary()
      .comment('Unique identification of an article')

    t.string('title', 200).notNullable()
      .comment('Title of an article')

    t.string('description', 1000).nullable()
      .comment('Description of an article')

    t.string('created_at').notNullable()
      .comment('Creation date of an article')

    t.string('updated_at').nullable()
      .comment('Update date of an article (if NULL was never updated)')
  })
}

exports.down = knex => knex.schema.dropTableIfExists('articles')
