'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/guides/routing
|
*/

const Route = use('Route')

Route.get('/receive', 'RobotController.receive')

Route.get('/updateLastKeyboardInput','RobotController.updateLastKeyboardInput')

Route.any('*', 'NuxtController.render')

