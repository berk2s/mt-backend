/**
 * @module app.controller.subscription
 */

import stripeService from '@app/services/stripe/stripe.service'
import { IncomingRequest } from '@app/types/controller.types'
import { NextFunction, Response } from 'express'
import { SubscribeRequest } from './subscription-controller.types'

/**
 * Subscription Controller
 * @class
 * @alias app.controller.subscription.SubscriptionController
 */
class SubscriptionController {
  public readonly ENDPOINT: string = '/subscriptions'

  /**
   * Handles subscribe request
   */
  public async subscribe(
    req: IncomingRequest<SubscribeRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId, userEmail } = req
      const { lookUpKey } = req.bodyDto

      const createdSession = await stripeService.createSession(
        userId,
        userEmail,
        lookUpKey,
      )

      res.status(200).json(createdSession)
    } catch (err) {
      next(err)
    }
  }
}

export default new SubscriptionController()
