'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MineurSchema extends Schema {
  up () {
    this.create('mineurs', (table) => {
      table.increments()
      table.string('pseudonyme', 80)
      table.timestamps()
    })
  }

  down () {
    this.drop('mineurs')
  }
}

module.exports = MineurSchema
