/**
 * @module app.mappers
 */

import { SubscriptionPackageDocument } from '@app/model/subscription/Package'
import { SubscriptionDocument } from '@app/model/subscription/Subscription'
import {
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
      period: document.period,
      likeLimit: document.likeLimit,
      canSeePersonalTrainers: document.canSeePersonalTrainers,
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
}
