/**
 * @module app.services.subscription
 */

import { DocumentNotFound } from '@app/exceptions/document-not-found-error'
import { SubscriptionMapper } from '@app/mappers/subscription.mapper'
import {
  Subscription,
  SubscriptionModel,
} from '@app/model/subscription/Subscription'
import { SubscriptionResponse } from '@app/types/response.types'
import { loggers } from 'winston'
import loggerService from '../logger/logger-service'
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
    packageId: string,
  ): Promise<SubscriptionResponse> {
    this.checkUserExists(athleteId)
    const subscriptionPackage = await subscriptionPackageService.getById(
      packageId,
    )

    const now = new Date()
    const endDate = new Date()
    endDate.setSeconds(endDate.getSeconds() + subscriptionPackage.period)

    const subscription = new Subscription({
      user: athleteId,
      package: packageId,
      status: 'ACTIVE',
      startDate: now,
      endDate: endDate,
    })
    await subscription.save()

    loggerService.info(
      `The Athlete subscribed to a package [userId: ${athleteId}, packageId: ${packageId}]`,
    )

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
}

export default new SubscriptionService()
