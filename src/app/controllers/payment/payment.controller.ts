/**
 * @module app.controller.payment
 */

import stripeService from '@app/services/stripe/stripe.service'
import { IncomingRequest } from '@app/types/controller.types'
import { NextFunction, Response } from 'express'
import { SubscribePaymentRequest } from './payment-controller.types'

/**
 * Payment Controller
 * @class
 * @alias app.controller.payment.PaymentController
 */
class PaymentController {
  public readonly ENDPOINT: string = '/payments'

  /**
   * Handles subscribe payment request
   */
  public async subscribe(
    req: IncomingRequest<SubscribePaymentRequest>,
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

export default new PaymentController()
