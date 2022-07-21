/**
 * @module app.routes
 */

import { Application } from 'express'
import healthController from '@app/controllers/health-controller/health.controller'
import registerController from '@app/controllers/register-controller/register.controller'
import { bodyValidation } from '@app/middlewares/body-validation.middleware'
import { RegisterUserRequest } from '@app/controllers/register-controller/register-controller.types'

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
      .route(registerController.ENDPOINT)
      .post(
        bodyValidation<RegisterUserRequest>(RegisterUserRequest),
        registerController.registerUser,
      )
  }
}

export default new Routes()
