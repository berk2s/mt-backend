/**
 * @module app
 */

import express from 'express'
import bodyParser from 'body-parser'
import routes, { Routes } from './routes/routes'

/**
 * Application starter
 * @class
 * @alias app.applicationStarter
 */
class App {
  /**
   * Holds express top-level function
   */
  public app: express.Application

  /**
   * Holds already-defined routes from config file
   */
  private routes: InstanceType<typeof Routes>

  /**
   * Constructs express and already-defined routes
   * @constructor
   */
  constructor() {
    this.app = express()
    this.routes = routes

    this.app.use(bodyParser.json({ limit: '5mb' }))
    this.app.use(bodyParser.urlencoded({ extended: false }))

    this.routes.routes(this.app)
  }
}

export default new App()
