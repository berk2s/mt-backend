/**
 * @module app.services.stripe
 */

import stripeConfig from '@app/config/stripke.config'
import { StripeError } from '@app/exceptions/stripe-error'
import { CreatedSessionResponse } from '@app/types/response.types'
import Stripe from 'stripe'
import loggerService from '../logger/logger-service'
/**
 * Stripe service
 * @class
 * @alias app.services.stripe.StripeService
 */
class StripeService {
  private stripe: Stripe
  constructor() {
    const { apiSecret } = stripeConfig
    this.stripe = new Stripe(apiSecret, {
      apiVersion: stripeConfig.apiVersion as any,
    })
  }

  /**
   * Creates checkout session
   */
  public async createSession(
    userId: string,
    userEmail: string,
    lookUpKey: string,
  ): Promise<CreatedSessionResponse> {
    const price = await this.getPrice(lookUpKey)

    const createSessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: userEmail,
      client_reference_id: userId,
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      success_url: stripeConfig.success_url,
      cancel_url: stripeConfig.cancel_url,
    }

    const session = await this.stripe.checkout.sessions.create(
      createSessionParams,
    )

    return {
      sessionUrl: session.url,
    }
  }

  /**
   * Gets price by look up key
   */
  public async getPrice(lookUpKey: string) {
    try {
      const prices = await this.stripe.prices.list({
        lookup_keys: [lookUpKey],
        expand: ['data.product'],
      })

      if (prices.data && prices.data.length === 0) {
        loggerService.warn(
          `Price with the given look up ket doesn't exists [lookUpKey: ${lookUpKey}]`,
        )
        throw new StripeError('lookUpKey.notFound')
      }

      return prices.data[0]
    } catch (err) {
      loggerService.warn(
        `Something happened while getting price list [lookUpKey: ${lookUpKey}, error: ${err}]`,
      )
      throw new StripeError('lookUpKey.error')
    }
  }
}

export default new StripeService()
