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

Route.get('/mine/:bloc', 'BlockController.mine')

Route.get('/mineurs', 'BlockController.getMineurs')

Route.get('/block', 'BlockController.get')

Route.post('/receive', 'BlockController.receive')

Route.any('*', 'NuxtController.render')
