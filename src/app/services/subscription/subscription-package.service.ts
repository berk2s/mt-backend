/**
 * @module app.services.subscription
 */

import { CreatePremiumPackageRequest } from '@app/controllers/subscriptions/subscription-controller.types'
import { DocumentNotFound } from '@app/exceptions/document-not-found-error'
import { SubscriptionMapper } from '@app/mappers/subscription.mapper'
import {
  SubscriptionPackageModel,
  SubscriptionPackage,
} from '@app/model/subscription/Package'
import { PremiumPackage } from '@app/model/subscription/PremiumPackage'
import { SubscriptionPackageResponse } from '@app/types/response.types'
import { ObjectIdUtility } from '@app/utilities/objectid-utility'
import { RandomUtility } from '@app/utilities/random-utility'
import loggerService from '../logger/logger-service'
import stripeService from '../stripe/stripe.service'

/**
 * Subscription Package service
 * @class
 * @alias app.services.subscription.Subscription
 */
class SubscriptionPackageService {
  private subscriptionPackage: SubscriptionPackageModel

  constructor() {
    this.subscriptionPackage = SubscriptionPackage
  }

  /**
   * Gets subscription by id
   */
  public async getById(
    packageId: string,
  ): Promise<SubscriptionPackageResponse> {
    const subscriptionPackage = await this.subscriptionPackage.findOne({
      _id: packageId,
    })

    if (!subscriptionPackage) {
      loggerService.warn(
        `Package with the given id doesn't exists [packageId: ${packageId}]`,
      )
      throw new DocumentNotFound('subscriptionPackage.notFound')
    }

    return Promise.resolve(SubscriptionMapper.packageToDTO(subscriptionPackage))
  }

  /**
   * Checks subscription exists by id or not
   */
  public async existsById(packageId: string): Promise<boolean> {
    if (!ObjectIdUtility.isValid(packageId)) {
      return false
    }

    var doesPackageExists = this.subscriptionPackage.exists({
      _id: packageId,
    })

    return Promise.resolve(doesPackageExists ? true : false)
  }

  /**
   * Gets subscription package by foregin ref
   */
  public async getByForeginRef(
    foreginRef: string,
  ): Promise<SubscriptionPackageResponse> {
    const subscriptionPackage = await this.subscriptionPackage.findOne({
      foreginRef: foreginRef,
    })

    if (!subscriptionPackage) {
      loggerService.warn(
        `Package with the given ref doesn't exists [foreginRef: ${foreginRef}]`,
      )
      throw new DocumentNotFound('subscriptionPackage.notFound')
    }

    return Promise.resolve(SubscriptionMapper.packageToDTO(subscriptionPackage))
  }

  /**
   * Creates subscription package
   */
  public async createPremiumPackage(
    createSubscriptionRequest: CreatePremiumPackageRequest,
  ): Promise<SubscriptionPackageResponse> {
    const {
      packageName,
      unitAmonut,
      currency,
      subscriptionInterval,
      likeLimit,
      canSeePersonalTrainers,
      packageDescription,
    } = createSubscriptionRequest

    const product = await stripeService.createProduct(packageName)

    const lookupKey = RandomUtility.randomString(48)

    const price = await stripeService.createPrice({
      unit_amount: unitAmonut,
      currency: currency,
      recurring: {
        interval: subscriptionInterval,
      },
      product: product.id,
      lookup_key: lookupKey,
    })

    const premiumPackage = new PremiumPackage({
      packageName: packageName,
      packageDescription: packageDescription,
      period: subscriptionInterval,
      price: unitAmonut,
      currency: currency,
      likeLimit: likeLimit,
      canSeePersonalTrainers: canSeePersonalTrainers,
      foreginProductId: product.id,
      foreginPriceId: price.id,
      foreginRef: lookupKey,
    })

    premiumPackage.save()

    loggerService.info(
      `A Subscription Package created [packageName: ${packageName}]`,
    )

    return Promise.resolve(SubscriptionMapper.premiumToDTO(premiumPackage))
  }
}

export default new SubscriptionPackageService()
