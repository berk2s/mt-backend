/**
 * @module app.routes
 */

import { Application } from 'express'
import healthController from '@app/controllers/health/health.controller'
import { bodyValidation } from '@app/middlewares/body-validation.middleware'
import {
  DislikeAthleteRequest,
  LikeAthleteRequest,
  RegisterAthleteRequest,
} from '@app/controllers/athlete/athlete-controller.types'
import athleteController from '@app/controllers/athlete/athlete.controller'
import uploadMiddleware from '@app/middlewares/image-upload.middleware'
import userController from '@app/controllers/user/user.controller'
import loginController from '@app/controllers/login/login.controller'
import { LoginRequest } from '@app/controllers/login/login-controller.types'
import { tokenVerify } from '@app/middlewares/token-verify.middleware'
import paymentController from '@app/controllers/subscriptions/subscription.controller'
import {
  CreatePremiumPackageRequest,
  SubscribeRequest,
} from '@app/controllers/subscriptions/subscription-controller.types'
import bodyParser from 'body-parser'

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
      .route(loginController.ENDPOINT)
      .post(bodyValidation<LoginRequest>(LoginRequest), loginController.login)

    app
      .route(`${userController.ENDPOINT}/avatar/:userId`)
      .put(
        tokenVerify,
        uploadMiddleware.single('profileImage'),
        userController.updateProfilePhoto,
      )

    app
      .route(athleteController.ENDPOINT)
      .post(
        bodyValidation<RegisterAthleteRequest>(RegisterAthleteRequest),
        athleteController.registerUser,
      )

    app
      .route(`${athleteController.ENDPOINT}/likes`)
      .post(
        tokenVerify,
        bodyValidation<LikeAthleteRequest>(LikeAthleteRequest),
        athleteController.likeAthlete,
      )

    app
      .route(`${athleteController.ENDPOINT}/dislikes`)
      .post(
        tokenVerify,
        bodyValidation<DislikeAthleteRequest>(DislikeAthleteRequest),
        athleteController.dislikeAthlete,
      )

    app
      .route(`${athleteController.ENDPOINT}/matching/:matchingId/unlink`)
      .put(tokenVerify, athleteController.unlinkMatching)

    app
      .route(`${paymentController.ENDPOINT}/subscribe`)
      .post(
        tokenVerify,
        bodyValidation<SubscribeRequest>(SubscribeRequest),
        paymentController.subscribe,
      )

    app
      .route(`${paymentController.ENDPOINT}/webhook`)
      .post(paymentController.webhook)

    app
      .route(`${paymentController.ENDPOINT}/unsubscribe`)
      .post(
        tokenVerify,
        bodyValidation<SubscribeRequest>(SubscribeRequest),
        paymentController.unsubscribe,
      )

    app
      .route(`${paymentController.ENDPOINT}/packages/premiums`)
      .post(
        tokenVerify,
        bodyValidation<CreatePremiumPackageRequest>(
          CreatePremiumPackageRequest,
        ),
        paymentController.createPremiumPackage,
      )
  }
}

export default new Routes()
