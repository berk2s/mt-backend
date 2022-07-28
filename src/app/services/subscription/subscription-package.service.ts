/**
 * @module app.services.subscription
 */

import {
  CreatePTPackageRequest,
  UpdatePTPackageRequest,
} from '@app/controllers/personal-trainer/personal-trainer.types'
import { CreatePremiumPackageRequest } from '@app/controllers/subscriptions/subscription-controller.types'
import { DocumentNotFound } from '@app/exceptions/document-not-found-error'
import { SubscriptionMapper } from '@app/mappers/subscription.mapper'
import {
  SubscriptionPackageModel,
  SubscriptionPackage,
} from '@app/model/subscription/Package'
import { PremiumPackage } from '@app/model/subscription/PremiumPackage'
import { PTPackage } from '@app/model/subscription/PTPackage'
import {
  PremiumPackageResponse,
  PTPackageResponse,
  SubscriptionPackageResponse,
} from '@app/types/response.types'
import { ObjectIdUtility } from '@app/utilities/objectid-utility'
import { RandomUtility } from '@app/utilities/random-utility'
import { Model } from 'mongoose'
import loggerService from '../logger/logger-service'
import stripeService from '../stripe/stripe.service'
import userService from '../user/user.service'

/**
 * Subscription Package service
 * @class
 * @alias app.services.subscription.Subscription
 */
class SubscriptionPackageService {
  private subscriptionPackage: SubscriptionPackageModel
  private premiumPackage: Model<any>
  private ptPackage: Model<any>

  constructor() {
    this.subscriptionPackage = SubscriptionPackage
    this.premiumPackage = PremiumPackage
    this.ptPackage = PTPackage
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
  ): Promise<PremiumPackageResponse> {
    const subscriptionPackage = await this.premiumPackage.findOne({
      foreginRef: foreginRef,
    })

    if (!subscriptionPackage) {
      loggerService.warn(
        `Package with the given ref doesn't exists [foreginRef: ${foreginRef}]`,
      )
      throw new DocumentNotFound('subscriptionPackage.notFound')
    }

    return Promise.resolve(SubscriptionMapper.premiumToDTO(subscriptionPackage))
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

  /**
   * Lists all created premium packagaes
   */
  public async getPremiumPackages(): Promise<PremiumPackageResponse[]> {
    const packages = await this.premiumPackage.find()

    return Promise.resolve(SubscriptionMapper.packagesToDTO(packages))
  }

  /**
   * Creates Personal Trainer Package
   */
  public async createPTPackage(
    userId: string,
    req: CreatePTPackageRequest,
  ): Promise<PTPackageResponse> {
    await this.checkPTExists(userId)

    const {
      packageName,
      packageDescription,
      unitAmonut,
      currency,
      subscriptionInterval,
      workoutType,
    } = req

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

    const ptPackage = new PTPackage({
      packageName: packageName,
      packageDescription: packageDescription,
      period: subscriptionInterval,
      price: unitAmonut,
      currency: currency,
      foreginProductId: product.id,
      foreginPriceId: price.id,
      foreginRef: lookupKey,
      workoutType: workoutType,
      personalTrainer: userId,
    })

    await ptPackage.save()

    loggerService.info(
      `A Personal Trainer subscription package created [packageName: ${packageName}]`,
    )

    return Promise.resolve(SubscriptionMapper.ptPackagetoDTO(ptPackage))
  }

  /**
   * Updates personal trainer package
   */
  public async updatePTPackage(
    packageId: string,
    req: UpdatePTPackageRequest,
  ): Promise<PTPackageResponse> {
    const {
      packageName,
      packageDescription,
      unitAmonut,
      currency,
      subscriptionInterval,
      workoutType,
    } = req

    const ptPackage = await this.ptPackage.findById(packageId)

    if (!ptPackage) {
      loggerService.warn(
        `Personal trainer package with the given id doesn't exists [packageId: ${packageId}]`,
      )
      throw new DocumentNotFound('package.notFound')
    }

    ptPackage.packageName = packageName
    ptPackage.packageDescription = packageDescription
    ptPackage.unitAmonut = unitAmonut
    ptPackage.currency = currency
    ptPackage.subscriptionInterval = subscriptionInterval
    ptPackage.workoutType = workoutType

    await ptPackage.save()

    loggerService.info(
      `Personal trainer package updated [packateId: ${packageId}]`,
    )

    return Promise.resolve(SubscriptionMapper.ptPackagetoDTO(ptPackage))
  }

  private async checkPTExists(ptId: string) {
    const exists = await userService.existsById(ptId)

    if (!exists) {
      loggerService.warn(
        `Personal trainer with the given id doens't exists [ptId: ${ptId}]`,
      )
      throw new DocumentNotFound('personalTrainer.notFound')
    }
  }
}

export default new SubscriptionPackageService()
