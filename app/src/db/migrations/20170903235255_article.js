exports.up = knex => {
  return knex.schema.createTable('articles', table => {
    table
      .increments('id')
      .primary()
      .comment('Unique identification of an article')

    table
      .string('title', 200)
      .notNullable()
      .comment('Title of an article')

    table
      .string('description', 1000)
      .nullable()
      .comment('Description of an article')

    table
      .string('created_at')
      .notNullable()
      .comment('Creation date of an article')

    table
      .string('updated_at')
      .nullable()
      .comment('Update date of an article (if NULL was never updated)')
  })
}

exports.down = knex => knex.schema.dropTableIfExists('articles')
