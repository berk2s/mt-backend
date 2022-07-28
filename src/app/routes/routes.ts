/**
 * @module app.routes
 */

import { Application } from 'express'
import healthController from '@app/controllers/health/health.controller'
import { bodyValidation } from '@app/middlewares/body-validation.middleware'
import {
  RegisterAthleteRequest,
  UpdateAthleteRequest,
  UpdateGEOLocation,
} from '@app/controllers/athlete/athlete-controller.types'
import athleteController from '@app/controllers/athlete/athlete.controller'
import uploadMiddleware from '@app/middlewares/image-upload.middleware'
import userController from '@app/controllers/user/user.controller'
import loginController from '@app/controllers/login/login.controller'
import { LoginRequest } from '@app/controllers/login/login-controller.types'
import { tokenVerify } from '@app/middlewares/token-verify.middleware'
import subscriptionController from '@app/controllers/subscriptions/subscription.controller'
import {
  CreatePremiumPackageRequest,
  SubscribeRequest,
} from '@app/controllers/subscriptions/subscription-controller.types'
import chatController from '@app/controllers/chat/chat.controller'
import { SendMessageRequest } from '@app/controllers/chat/chat-controller.types'
import gymController from '@app/controllers/gym/gym.controller'
import { CreateGymRequest } from '@app/controllers/gym/gym-controller.typs'
import discoveryController from '@app/controllers/discovery/discovery.controller'
import personalTrainerController from '@app/controllers/personal-trainer/personal-trainer.controller'
import {
  CreatePTPackageRequest,
  MyPackagesRequest,
  PTInfoRequest,
  RegisterPersonalTrainer,
  UpdatePTPackageRequest,
  UpdatePTRequest,
} from '@app/controllers/personal-trainer/personal-trainer.types'

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
      .route(`${userController.ENDPOINT}/avatar`)
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
      .route(`${athleteController.ENDPOINT}/likes/:likedAthleteId`)
      .post(tokenVerify, athleteController.likeAthlete)

    app
      .route(`${athleteController.ENDPOINT}/dislikes/:dislikedAthleteId`)
      .post(tokenVerify, athleteController.dislikeAthlete)

    app
      .route(`${athleteController.ENDPOINT}/matching/:matchingId/unlink`)
      .put(tokenVerify, athleteController.unlinkMatching)

    app
      .route(`${subscriptionController.ENDPOINT}/subscribe`)
      .post(
        tokenVerify,
        bodyValidation<SubscribeRequest>(SubscribeRequest),
        subscriptionController.subscribe,
      )

    app
      .route(`${subscriptionController.ENDPOINT}/webhook`)
      .post(subscriptionController.webhook)

    app
      .route(`${subscriptionController.ENDPOINT}/unsubscribe`)
      .post(
        tokenVerify,
        bodyValidation<SubscribeRequest>(SubscribeRequest),
        subscriptionController.unsubscribe,
      )

    app
      .route(`${subscriptionController.ENDPOINT}/packages/premiums`)
      .post(
        tokenVerify,
        bodyValidation<CreatePremiumPackageRequest>(
          CreatePremiumPackageRequest,
        ),
        subscriptionController.createPremiumPackage,
      )

    app
      .route(`${chatController.ENDPOINT}/:chatId/messages`)
      .post(
        tokenVerify,
        bodyValidation<SendMessageRequest>(SendMessageRequest),
        chatController.sendMessage,
      )

    app
      .route(`${gymController.ENDPOINT}`)
      .post(
        tokenVerify,
        bodyValidation<CreateGymRequest>(CreateGymRequest),
        gymController.create,
      )

    app
      .route(`${userController.ENDPOINT}/gyms/:gymId`)
      .put(tokenVerify, userController.updateGym)

    app
      .route(`${athleteController.ENDPOINT}/me`)
      .get(tokenVerify, athleteController.getUserInfo)

    app
      .route(athleteController.ENDPOINT)
      .put(
        tokenVerify,
        bodyValidation<UpdateAthleteRequest>(UpdateAthleteRequest),
        athleteController.updateAthlete,
      )

    app.route(gymController.ENDPOINT).get(gymController.gyms)

    app
      .route(`${userController.ENDPOINT}/me`)
      .get(tokenVerify, userController.userInfo)

    app
      .route(discoveryController.ENDPOINT)
      .get(tokenVerify, discoveryController.discover)

    app.route(chatController.ENDPOINT).get(tokenVerify, chatController.myChats)

    app
      .route(`${chatController.ENDPOINT}/:chatId/messages`)
      .get(tokenVerify, chatController.chatMessages)

    app
      .route(`${subscriptionController.ENDPOINT}/packages/premiums`)
      .get(tokenVerify, subscriptionController.getPremiumPackages)

    app
      .route(`${athleteController.ENDPOINT}/geolocation`)
      .put(
        tokenVerify,
        bodyValidation<UpdateGEOLocation>(UpdateGEOLocation),
        athleteController.updateGeoLocation,
      )

    app
      .route(personalTrainerController.ENDPOINT)
      .post(
        bodyValidation<RegisterPersonalTrainer>(RegisterPersonalTrainer),
        personalTrainerController.registerPersonalTrainer,
      )

    app
      .route(`${personalTrainerController.ENDPOINT}/certificates`)
      .put(
        tokenVerify,
        uploadMiddleware.any('certificates'),
        personalTrainerController.addCertificates,
      )

    app
      .route(`${personalTrainerController.ENDPOINT}/packages`)
      .post(
        tokenVerify,
        bodyValidation<CreatePTPackageRequest>(CreatePTPackageRequest),
        personalTrainerController.createPTPackage,
      )

    app
      .route(`${personalTrainerController.ENDPOINT}/me`)
      .get(
        tokenVerify,
        bodyValidation<PTInfoRequest>(PTInfoRequest),
        personalTrainerController.getPTInfo,
      )

    app
      .route(`${personalTrainerController.ENDPOINT}`)
      .get(tokenVerify, personalTrainerController.getPersonalTrainers)

    app
      .route(`${personalTrainerController.ENDPOINT}/packages/:packageId`)
      .put(
        tokenVerify,
        bodyValidation<UpdatePTPackageRequest>(UpdatePTPackageRequest),
        personalTrainerController.updatePTPackage,
      )

    app
      .route(`${personalTrainerController.ENDPOINT}/packages/:packageId`)
      .delete(tokenVerify, personalTrainerController.deletePTPackage)

    app
      .route(`${personalTrainerController.ENDPOINT}`)
      .put(
        tokenVerify,
        bodyValidation<UpdatePTRequest>(UpdatePTRequest),
        personalTrainerController.updatePTProfile,
      )

    app
      .route(`${personalTrainerController.ENDPOINT}/packages`)
      .get(
        tokenVerify,
        bodyValidation<MyPackagesRequest>(MyPackagesRequest),
        personalTrainerController.getMyPackages,
      )

    app
      .route(`${personalTrainerController.ENDPOINT}/packages/:packageId`)
      .get(tokenVerify, personalTrainerController.getPackage)
  }
}

export default new Routes()
