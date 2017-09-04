exports.up = knex => {
  return knex.schema.createTable('articles', t => {
    t.increments('id')
    t.string('title', 200).notNullable()
    t.string('description', 1000).nullable()
    t.string('created_at').notNullable()
    t.string('updated_at').nullable()
  })
}

exports.down = knex => knex.schema.dropTableIfExists('articles')
