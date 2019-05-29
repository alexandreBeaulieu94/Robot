'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Ecriture extends Model {

  blocs(){
    return this.belongsTo('App/Models/Bloc','id', 'bloc_id')
  }

    // static get updatedAtColumn () {
    //     return 'datetime'
    // }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }
}

module.exports = Ecriture
