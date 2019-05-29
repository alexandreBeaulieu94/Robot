'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Bloc extends Model {


  ecritures() {
    return this.hasMany('App/Models/Ecriture')
  }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }

    // static get updatedAtColumn () {
    //     return 'datetime'
    // }
}

module.exports = Bloc
