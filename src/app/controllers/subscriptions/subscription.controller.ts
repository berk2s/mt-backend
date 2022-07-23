/**
 * @module app.controller.subscription
 */

import stripeService from '@app/services/stripe/stripe.service'
import subscriptionPackageService from '@app/services/subscription/subscription-package.service'
import subscriptionService from '@app/services/subscription/subscription.service'
import { IncomingRequest } from '@app/types/controller.types'
import { NextFunction, Response } from 'express'
import {
  CreatePremiumPackageRequest,
  SubscribeRequest,
  UnsubscribeRequest,
  WebhookRequest,
} from './subscription-controller.types'

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
      const { foreginRef: lookUpKey } = req.bodyDto

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

  /**
   * Handles webhook request that comes from Stripe
   */
  public async webhook(
    req: IncomingRequest<WebhookRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const rawBody = req.rawBody
      const signature = req.headers['stripe-signature']

      await stripeService.webhook(rawBody, signature)

      res.send()
    } catch (err) {
      next(err)
    }
  }

  /**
   * Handles unsubscribe request
   */
  public async unsubscribe(
    req: IncomingRequest<UnsubscribeRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req
      const { foreginRef } = req.bodyDto

      const subscription = await subscriptionService.unsubscribe(
        userId,
        foreginRef,
      )

      res.status(200).send(subscription)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Handlres create premium request
   */
  public async createPremiumPackage(
    req: IncomingRequest<CreatePremiumPackageRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const premiumPackage = await subscriptionPackageService.createPremiumPackage(
        req.bodyDto,
      )

      return res.status(201).json(premiumPackage)
    } catch (err) {
      next(err)
    }
  }
}

export default new SubscriptionController()
