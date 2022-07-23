/**
 * @module app.services.subscription
 */

import { DocumentNotFound } from '@app/exceptions/document-not-found-error'
import { SubscriptionMapper } from '@app/mappers/subscription.mapper'
import {
  SubscriptionPackageModel,
  SubscriptionPackage,
} from '@app/model/subscription/Package'
import { ObjectIdUtility } from '@app/utilities/objectid-utility'
import loggerService from '../logger/logger-service'

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

  public async getById(packageId: string): Promise<PackageResponse> {
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

  public async existsById(packageId: string): Promise<boolean> {
    if (!ObjectIdUtility.isValid(packageId)) {
      return false
    }

    var doesPackageExists = this.subscriptionPackage.exists({
      _id: packageId,
    })

    return Promise.resolve(doesPackageExists ? true : false)
  }
}

export default new SubscriptionPackageService()
