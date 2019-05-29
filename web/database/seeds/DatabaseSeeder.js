'use strict'

/*
|--------------------------------------------------------------------------
| DatabaseSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class DatabaseSeeder {
  async run () {
      for (let i = 0; i < 3; i++) {
          let bloc = await Factory.model('App/Models/Bloc').create()
          let ecriture = await Factory.model('App/Models/Ecriture').makeMany(10)
          bloc.ecritures().saveMany(ecriture);
      }
      
      let mineurs = await Factory.model('App/Models/Mineur').createMany(100);
  }
}

module.exports = DatabaseSeeder
