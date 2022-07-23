/**
 * @module app.services.subscription
 */

import { DocumentNotFound } from '@app/exceptions/document-not-found-error'
import { StripeError } from '@app/exceptions/stripe-error'
import { SubscriptionMapper } from '@app/mappers/subscription.mapper'
import {
  Subscription,
  SubscriptionModel,
} from '@app/model/subscription/Subscription'
import { SubscriptionResponse } from '@app/types/response.types'
import loggerService from '../logger/logger-service'
import stripeService from '../stripe/stripe.service'
import userService from '../user/user.service'
import subscriptionPackageService from './subscription-package.service'

/**
 * Subscription service
 * @class
 * @alias app.services.subscription.Subscription
 */
class SubscriptionService {
  private subscription: SubscriptionModel

  constructor() {
    this.subscription = Subscription
  }

  /**
   * Subscribes Athletes to a subscription package
   */
  public async subscribe(
    athleteId: string,
    packageName: string,
    foreginId: string,
  ): Promise<SubscriptionResponse> {
    await this.checkUserExists(athleteId)
    await this.checkForeginIdExist(foreginId)

    const subscriptionPackage = await subscriptionPackageService.getByName(
      packageName,
    )

    const now = new Date()
    const endDate = new Date()
    endDate.setSeconds(endDate.getSeconds() + subscriptionPackage.period)

    const subscription = new Subscription({
      foreginId: foreginId,
      user: athleteId,
      package: subscriptionPackage.id,
      status: 'ACTIVE',
      startDate: now,
      endDate: endDate,
    })
    await subscription.save()

    loggerService.info(
      `The Athlete subscribed to a package [userId: ${athleteId}, packageId: ${packageName}]`,
    )

    return Promise.resolve(SubscriptionMapper.subscribeToDTO(subscription))
  }

  /**
   * Unsubscribes the Athlete
   */
  public async unsubscribe(
    athleteId: string,
    packageName: string,
  ): Promise<SubscriptionResponse> {
    const foreginSubscription = await stripeService.getSubscriptionByAthleteAndProduct(
      athleteId,
      packageName,
    )

    const subscriptionPackage = await subscriptionPackageService.getByName(
      packageName,
    )

    const subscription = await Subscription.findOne({
      user: athleteId,
      package: subscriptionPackage.id,
      status: 'ACTIVE',
    })

    if (foreginSubscription)
      await stripeService.unsubscribe(foreginSubscription.id)

    subscription.status = 'INACTIVE'
    await subscription.save()

    loggerService.info('The Athlete unsubscribed a package')

    return Promise.resolve(SubscriptionMapper.subscribeToDTO(subscription))
  }

  private async checkUserExists(userId: string) {
    const doesUserExist = await userService.existsById(userId)

    if (!doesUserExist) {
      loggerService.warn(
        `User with the given id doesn't exists [userId: ${userId}]`,
      )
      throw new DocumentNotFound('user.notFound')
    }
  }

  private async checkForeginIdExist(foreginId: string) {
    const doesForeginIdExists = await stripeService.getSubscriptionById(
      foreginId,
    )

    if (!doesForeginIdExists) {
      loggerService.warn(`Foregin ID doesn't exist [foreginId: ${foreginId}]`)
      throw new StripeError('subscription.notFound')
    }

    return doesForeginIdExists ? true : false
  }
}

export default new SubscriptionService()
