'use strict'
const Bloc = use('App/Models/Bloc')

class HomeController {

  async index ({ view }) {
    const blocs = await Bloc .query().with('Ecriture').fetch()
    return view.render('home', { blocs: blocs.toJSON() })
  }

}


module.exports = HomeController
