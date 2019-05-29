'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BlocSchema extends Schema {
  up () {
    this.create('blocs', (table) => {
      table.increments()
      table.string('preuve', 80)
      table.string('hashPrecedant', 256).notNullable()
      table.string('hashCourant', 256)
      table.datetime('datetime')
      table.integer('signerPar',12)
      table.boolean('isValid')
    })
  }

  down () {
    this.drop('blocs')
  }
}

module.exports = BlocSchema
