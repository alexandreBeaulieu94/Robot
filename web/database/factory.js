'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

// Documentation faker: https://chancejs.com/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const digits = (d) => Math.pow(10, d)-1;

Factory.blueprint('App/Models/Bloc', (faker) => {
    return {
        preuve: faker.integer({ min: 0 }),
        hashPrecedant: faker.hash(),
        hashCourant: faker.hash(),
        datetime: faker.date(),
        signerPar: faker.integer({ min: 0, max: 12/*digits(12)*/ })
    }
})

Factory.blueprint('App/Models/Ecriture', (faker) => {
    return {
        montant: faker.floating({ min: 0, max: 12, fixed: 2 }),
        from: faker.name(),
        to: faker.name(),
        datetime: faker.date(),
        signer_par: faker.integer({ min: 0, max: 12/*digits(12)*/ })
    }
})

Factory.blueprint('App/Models/Mineur', (faker) => {
    return {
        pseudonyme: faker.username()
    }
})
