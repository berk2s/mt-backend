/**
 * @module app.mappers
 */

import { SubscriptionPackageDocument } from '@app/model/subscription/Package'
import { PremiumPackageDocument } from '@app/model/subscription/PremiumPackage'
import { SubscriptionDocument } from '@app/model/subscription/Subscription'
import {
  PremiumPackageResponse,
  SubscriptionPackageResponse,
  SubscriptionResponse,
} from '@app/types/response.types'

export abstract class SubscriptionMapper {
  public static packageToDTO(
    document: SubscriptionPackageDocument,
  ): SubscriptionPackageResponse {
    return {
      id: document._id,
      packageName: document.packageName,
      packageDescription: document.packageDescription,
      period: document.period,
      price: document.price,
      currency: document.currency,
      packageType: document.packageType,
      foreginProductId: document.foreginProductId,
      foreginPriceId: document.foreginPriceId,
      foreginRef: document.foreginRef ? document.foreginRef : null,
      createdAt: document.createdAt,
    }
  }

  public static subscribeToDTO(
    document: SubscriptionDocument,
  ): SubscriptionResponse {
    return {
      id: document._id,
      userId: document.user,
      packageId: document.package,
      status: document.status,
      startDate: document.startDate,
      endDate: document.endDate,
      createdAt: document.createdAt,
    }
  }

  public static premiumToDTO(
    document: PremiumPackageDocument,
  ): PremiumPackageResponse {
    return {
      id: document._id,
      packageName: document.packageName,
      packageDescription: document.packageDescription,
      period: document.period,
      price: document.price,
      currency: document.currency,
      packageType: document.packageType,
      likeLimit: document.likeLimit,
      canSeePersonalTrainers: document.canSeePersonalTrainers,
      foreginProductId: document.foreginProductId,
      foreginPriceId: document.foreginPriceId,
      foreginRef: document.foreginRef,
      createdAt: document.createdAt,
    }
  }

  public static packagesToDTO(
    documents: PremiumPackageDocument[],
  ): PremiumPackageResponse[] {
    return documents.map((i) => {
      return {
        ...SubscriptionMapper.packageToDTO(i),
        likeLimit: i.likeLimit,
        canSeePersonalTrainers: i.canSeePersonalTrainers,
      }
    })
  }
}
