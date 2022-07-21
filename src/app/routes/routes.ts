/**
 * @module app.routes
 */

import { Application } from 'express'
import healthController from '@app/controllers/health-controller/health.controller'
import { bodyValidation } from '@app/middlewares/body-validation.middleware'
import { RegisterAthleteRequest } from '@app/controllers/athlete-controller/athlete-controller.types'
import athleteController from '@app/controllers/athlete-controller/athlete.controller'

/**
 * Creates and configures routes that belongs to application
 * @class
 * @alias app.routes.RouteRegistration
 */
export class Routes {
  /**
   * Registers controllers to corresponding routes
   * @constructs
   * @param {Application} app - Passed variable that holds running application
   */
  public routes(app: Application): void {
    app.route(healthController.ENDPOINT).get(healthController.health)

    app
      .route(athleteController.ENDPOINT)
      .post(
        bodyValidation<RegisterAthleteRequest>(RegisterAthleteRequest),
        athleteController.registerUser,
      )
  }
}

export default new Routes()
