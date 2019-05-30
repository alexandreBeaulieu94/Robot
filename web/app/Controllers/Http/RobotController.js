'use strict'

const Bloc = use('App/Models/Bloc')
const crypto = require('crypto')
const Ecriture = use('App/Models/Ecriture')
const Database = use('Database')
const Mineur = use('App/Models/Mineur')
const adresseIP = "172.20.34.40";

var lastKeyboardInput = "test";
var validity =  Math.floor(Math.random() * 10000000)

class RobotController {
    async receive({ request, response }) {
        return response.json([{ command: lastKeyboardInput, validity: validity}])
    }

    async updateLastKeyboardInput({ params, response: res, request: req }){
        lastKeyboardInput = req.all().keyboardInput
        validity =  Math.floor(Math.random() * 10000000)
    }
}

module.exports = RobotController
