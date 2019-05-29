'use strict'

const Bloc = use('App/Models/Bloc')
const crypto = require('crypto')
const Ecriture = use('App/Models/Ecriture')
const Database = use('Database')
const Mineur = use('App/Models/Mineur')
const Difficulte = "000";

class BlockController {


    async get({ params, response: res }) {


        let blocks = await Bloc.query().with('ecritures', (builder) => builder.offset(0)).fetch()

        // La vérification se fait seulement s'il y a au moins un bloc qui est miné
        // car ça plantait si le premier bloc n'avait pas été miné
        blocks = blocks.toJSON();
        if (blocks.length !== 1 || (blocks.length === 1 && blocks[0].preuve !== null)) {

            this.verifHash()
        }

        blocks.forEach(block => block.ecritures.splice(10))
        res.json(blocks)
    }

    async getMineurs({ params, response: res }) {
        let mineurs = await Mineur.query().fetch()
        res.json(mineurs)
    }


    async receive({ request, response }) {

        let countBlocks = await Bloc.getCount()

        // Si c'est le premier block
        if (countBlocks === 0) {
            let premierBloc = new Bloc()

            premierBloc.hashPrecedant = '0000000000000000000000000000000000000000000000000000000000000000'
            premierBloc.hashCourant = '0000000000000000000000000000000000000000000000000000000000000000'


            premierBloc.save()

            // Pour être certain que le premier bloc est enregistré avant de poursuivre
            await sleep(500)
        }


        const ecritureRecu = request.post()


        let ecrit = new Ecriture()
        ecrit.from = ecritureRecu.from
        ecrit.to = ecritureRecu.to
        ecrit.montant = ecritureRecu.montant
        //ecrit.bloc_id = 0 // géré par un trigger dans la bd
        ecrit.date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
        ecrit.save()
    }


    async mine({ params, response: res, request: req }) {
        var hash = require('crypto');
        let blocId =  parseInt(params.bloc.substring(0,params.bloc.indexOf('-')))
        let mineurId =  parseInt(params.bloc.substring(params.bloc.indexOf('-')+1))

        let mineBloc = await Bloc.query().with('ecritures').where('id', blocId).first()


        // prends en compte le premier bloc
        let premierBloc =  await Bloc.first()


        if (mineBloc.id !== premierBloc.id){

            // Si le bloc a été réinitialisé, on prends le hash du précédent
            if (mineBloc.hashCourant === '0000000000000000000000000000000000000000000000000000000000000000' &&
                mineBloc.hashCourant === '0000000000000000000000000000000000000000000000000000000000000000')
            {

                let precBloc = await Bloc.query().with('ecritures').where('id', blocId-1).first()

                mineBloc.hashPrecedant = precBloc.hashCourant

            }
        }


        let mineBlocAsString = ""
        let hashing =  ""

        // Faut le faire avant car si on modifie dans la bd (voir énoncé), le hash est pas pareil
        mineBloc.signerPar = mineurId


        mineBloc.hashCourant = null

        mineBloc.preuve = 0
        while (hashing.substring(0, 3) !== Difficulte) {
            mineBloc.preuve = parseInt(mineBloc.preuve) + 1
            // On utilise le hashPrecent, la preuve (qui incrémente) et les données
            mineBlocAsString = JSON.stringify(mineBloc.toJSON())
            hashing =  crypto.createHash('sha256').update(mineBlocAsString).digest('hex')
        }

        mineBloc.isValid = 0
        mineBloc.hashCourant = hashing
        mineBloc.datetime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
        mineBloc.save()


        let mineBlocSuivant =  await Bloc.query().with('ecritures').where('id', mineBloc.id+1).first()

        // Si le bloc suivant est null, on en crée un nouveau
        if (mineBlocSuivant == null){
            // Après avoir miné, on crée un autre bloc qui deviendra le bloc actuel
            let mineBlocNouveauSuivant = new Bloc()
            // // On utilise le bloc miné avec hash
            mineBlocNouveauSuivant.hashPrecedant = mineBloc.hashCourant
            mineBlocNouveauSuivant.hashCourant = '0000000000000000000000000000000000000000000000000000000000000000'
            mineBlocNouveauSuivant.save()
        }
        else if (mineBlocSuivant.preuve == -1){
            // advenant que les blocs soient invalides, on autorise le minage
            mineBlocSuivant.preuve = null
            mineBlocSuivant.save()

        }


    }



    async verifHash (){

        var hash = require('crypto');

        // prends en compte le premier bloc
        var premierBloc =  await Bloc.first()

        var dernierBloc = await Bloc.last()

        var mineBlocs = await Bloc.query().with('ecritures').fetch()
        mineBlocs.rows.forEach((mineBloc, index) => {

            // On fait seulement la validation sur les blocs ayant été minés
            if (mineBloc.hashCourant !== '0000000000000000000000000000000000000000000000000000000000000000') {
                // Si ce n'est pas le premier bloc
                if (premierBloc.id !== mineBloc.id){
                    // On vérifie que le bloc précédent
                    var blocPrecedent = mineBlocs.rows[index-1]
                }
                // Si le bloc précédent est non valide, on modifie
                // On ne fait pas la validation dans ce cas
                if (typeof blocPrecedent !== 'undefined' && blocPrecedent.isValid !== 0){
                    // Réinit les valeurs du bloc
                    mineBloc.signerPar = null
                    mineBloc.datetime = null
                    mineBloc.preuve = -1
                    mineBloc.isValid = null
                    mineBloc.hashPrecedant = '0000000000000000000000000000000000000000000000000000000000000000'
                    mineBloc.hashCourant = '0000000000000000000000000000000000000000000000000000000000000000'
                }
                else {
                    // Sinon on valide le bloc
                    let preuve = mineBloc.preuve
                    let datetime = mineBloc.datetime

                    // remet les valeurs comme avant le minage pour utiliser seulement les données, et le hash précédent
                   // mineBloc.signerPar = null
                    mineBloc.datetime = null
                    mineBloc.preuve = null
                    mineBloc.isValid = null

                    // Si c'est le premier bloc, c'est différent pour ré-initialiser
                    if (premierBloc.id === mineBloc.id) {
                        mineBloc.hashPrecedant = '0000000000000000000000000000000000000000000000000000000000000000'
                    }


                    mineBloc.hashCourant = null

                    mineBloc.preuve = parseInt(preuve)

                    let mineBlocAsString = ""
                    let hashing = ""

                    mineBlocAsString = JSON.stringify(mineBloc.toJSON())
                    hashing =  crypto.createHash('sha256').update(mineBlocAsString).digest('hex')

                    mineBloc.hashCourant = hashing
                    mineBloc.datetime = datetime

                    if (hashing.substring(0,3) == Difficulte){
                        mineBloc.isValid = 0
                    }
                    else {
                        mineBloc.hashPrecedant = '0000000000000000000000000000000000000000000000000000000000000000'
                        mineBloc.hashCourant = '0000000000000000000000000000000000000000000000000000000000000000'
                        mineBloc.isValid = null
                        mineBloc.preuve = null
                        mineBloc.datetime = null
                        mineBloc.signerPar = null
                    }
                }
            }
            else if (mineBloc.id === dernierBloc.id){
                // Si lavant dernier bloc est invalide
                if (mineBlocs.rows[index-1].preuve === -1){
                    mineBloc.signerPar = null
                    mineBloc.datetime = null
                    mineBloc.preuve = -1
                    mineBloc.isValid = null
                    mineBloc.hashPrecedant = '0000000000000000000000000000000000000000000000000000000000000000'
                    mineBloc.hashCourant = '0000000000000000000000000000000000000000000000000000000000000000'
                }
            }


            mineBloc.save()

        })
    }
}


function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
}

module.exports = BlockController
