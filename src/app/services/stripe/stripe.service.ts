/**
 * @module app.services.stripe
 */

import stripeConfig from '@app/config/stripke.config'
import { StripeError } from '@app/exceptions/stripe-error'
import { CreatedSessionResponse } from '@app/types/response.types'
import Stripe from 'stripe'
import { loggers } from 'winston'
import loggerService from '../logger/logger-service'
import subscriptionService from '../subscription/subscription.service'
import { CreatePrice } from './stripe.types'

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

    const customer = await this.getCustomerByEmail(userEmail)

    if (await this.isSubscribedBefore(userId, lookUpKey)) {
      loggerService.warn(
        `The Athlete already subscribed [athleteId: ${userId}, lookUpKey: ${lookUpKey}]`,
      )
      throw new StripeError('user.subscribedBefore')
    }

    const createSessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: userEmail,
      subscription_data: {
        metadata: {
          athleteId: `${userId}`,
          lookupKey: `${lookUpKey}`,
        },
      },
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      success_url: stripeConfig.success_url,
      cancel_url: stripeConfig.cancel_url,
      ...(customer && { customer: customer.id }),
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
    let prices
    try {
      prices = await this.stripe.prices.list({
        lookup_keys: [lookUpKey],
        expand: ['data.product'],
      })
    } catch (err) {
      loggerService.warn(
        `Something happened while getting price list [lookUpKey: ${lookUpKey}, error: ${err}]`,
      )
      throw new StripeError('lookUpKey.error')
    }

    if (prices.data && prices.data.length === 0) {
      loggerService.warn(
        `Price with the given look up key doesn't exists [lookUpKey: ${lookUpKey}]`,
      )
      throw new StripeError('lookUpKey.notFound')
    }

    return prices.data[0]
  }

  /**
   * Handles webhook events that comes from Stripe
   */
  public async webhook(body: any, signature: any) {
    const { webhookSecret } = stripeConfig

    let event = body
    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret,
      )
    } catch (err) {
      loggerService.warn(`Webhook singature verification failed. ${err}`)
      throw new StripeError('webhook.failed')
    }

    const {
      metadata: { athleteId, lookupKey },
      id,
    } = event.data.object

    switch (event.type) {
      case 'customer.subscription.created':
        loggerService.info(
          `Subscription created webhook received [foreginId: ${id}, athleteId: ${athleteId}, lookupKey: ${lookupKey}]`,
        )
        subscriptionService.subscribe(athleteId, lookupKey, id)
        break
      case 'customer.subscription.deleted':
        loggerService.info(
          `Subscription deleted webhook received [foreginId: ${id}]`,
        )
        subscriptionService.unsubscribe(athleteId, lookupKey)
        break
      default:
        let eventId = null

        if (event.data && event.data.object && event.data.object.id)
          eventId = event.data.object.id

        loggerService.info(
          `An event received from Stripe [type: ${event.type}, id: ${eventId}]`,
        )
    }
  }

  /**
   * Gets Stripe customer
   */
  public async getCustomerByEmail(email: string): Promise<any> {
    let customer

    try {
      customer = await this.stripe.customers.list({
        email: email,
        limit: 1,
      })
    } catch (err) {
      loggerService.warn(
        `Something went wrong while getting Stripe customer [email: ${email}]`,
      )
      throw new StripeError('customer.error')
    }

    if (customer.data && customer.data.length === 0) {
      return null
    }

    return customer.data[0]
  }

  /**
   * Gets subscription by customer id
   */
  public async getSubscriptionByAthleteAndProduct(
    athleteId: string,
    lookUpKey: string,
  ): Promise<any> {
    let subscription

    try {
      subscription = await this.stripe.subscriptions.search({
        query:
          'status:"active" AND metadata["athleteId"]:"' +
          athleteId +
          '" AND metadata["lookupKey"]:"' +
          lookUpKey +
          '"',
      })
    } catch (err) {
      loggerService.warn(
        `Something went wrong while getting Stripe subscription by customer [customerId: ${athleteId}, err: ${err}]`,
      )
      throw new StripeError('subscription.error')
    }

    if (subscription.data && subscription.data.length === 0) return null

    return subscription.data[0]
  }

  /**
   * Gets subscription by subscription id
   */
  public async getSubscriptionById(subscriptionId: string) {
    let subscription

    try {
      subscription = await this.stripe.subscriptions.retrieve(subscriptionId)
    } catch (err) {
      loggerService.warn(
        `Something went wrong while getting Stripe subscription by subscription id [subscriptionId: ${subscriptionId}, err: ${err}]`,
      )
      throw new StripeError('subscription.error')
    }

    if (!subscription) return null

    return subscription
  }

  /**
   * Deletes subscription
   */
  public async unsubscribe(subscriptionId) {
    try {
      this.stripe.subscriptions.del(subscriptionId)
    } catch (err) {
      loggerService.warn(
        `Something went wrong while Stripe unsubscribing [subscriptionId: ${subscriptionId}, err: ${err}]`,
      )
      throw new StripeError('subscription.error')
    }
  }

  /**
   * Creates product
   */
  public async createProduct(productName: string) {
    try {
      const product = await this.stripe.products.create({
        name: productName,
      })

      loggerService.info(`A Stripe product created [productId: ${product.id}]`)

      return product
    } catch (err) {
      loggerService.warn(
        `Something went wrong while creating Stripe product [productName: ${productName}, error: ${err}]`,
      )
      throw new StripeError('creatingProduct.error')
    }
  }

  /**
   * Creates Price
   */
  public async createPrice(createPrice: CreatePrice) {
    try {
      const price = await this.stripe.prices.create({
        ...createPrice,
      })

      loggerService.info(`A Stripe price created [priceId: ${price.id}]`)

      return price
    } catch (err) {
      loggerService.warn(
        `Something went wrong while creating price [price: ${JSON.stringify(
          createPrice,
        )}, error: ${err}]`,
      )
      throw new StripeError('creatingPrice.error')
    }
  }

  private async isSubscribedBefore(
    athleteId: string,
    product: string,
  ): Promise<boolean> {
    const subscription = await this.getSubscriptionByAthleteAndProduct(
      athleteId,
      product,
    )

    if (!subscription) return false

    return true
  }
}

export default new StripeService()
