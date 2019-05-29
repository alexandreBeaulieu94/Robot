'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EcritureSchema extends Schema {
  up () {
    this.create('ecritures', (table) => {
      table.increments()
      table.float('montant', 12)
      table.string('from', 80).notNullable()
      table.string('to', 80).notNullable()
      table.integer('bloc_id',12).unsigned().notNullable()
      table.datetime('date')
    })
  }

  down () {
    this.drop('ecritures')
  }
}

module.exports = EcritureSchema
