'use strict'

const Bloc = use('App/Models/Bloc')
const crypto = require('crypto')
const Ecriture = use('App/Models/Ecriture')
const Database = use('Database')
const Mineur = use('App/Models/Mineur')
const adresseIP = "172.20.34.40";

var lastKeyboardInput = "test";

class RobotController {
    async receive({ request, response }) {
        response.json(lastKeyboardInput)
    }

    async updateLastKeyboardInput({ params, response: res, request: req }){
        lastKeyboardInput = req.all().keyboardInput
    }
}

module.exports = RobotController
