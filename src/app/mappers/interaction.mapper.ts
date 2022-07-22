/**
 * @module app.mappers
 */

import { LikeAthleteResponse } from '@app/controllers/athlete/athlete-controller.types'
import { LikedInteractionDocument } from '@app/model/interaction/LikedInteraction'

export abstract class InteractionMapper {
  public static likedInteractionToDTO(
    document: LikedInteractionDocument,
  ): LikeAthleteResponse {
    return {
      id: document._id,
      userId: document.user,
      toUserId: document.toUser,
      interactionType: document.interactionType,
      createdAt: document.createdAt,
    }
  }
}
