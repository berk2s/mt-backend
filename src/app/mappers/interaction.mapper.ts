/**
 * @module app.mappers
 */

import {
  DislikeAthleteResponse,
  LikeAthleteResponse,
} from '@app/controllers/athlete/athlete-controller.types'
import { DislikedInteractionDocument } from '@app/model/interaction/DislikedInteraction'
import { LikedInteractionDocument } from '@app/model/interaction/LikedInteraction'

export abstract class InteractionMapper {
  public static likedInteractionToDTO(
    document: LikedInteractionDocument | any,
  ): LikeAthleteResponse {
    return {
      id: document._id,
      userId: document.user,
      toUserId: document.toUser,
      interactionType: document.interactionType,
      matching: document.matching,
      createdAt: document.createdAt,
    }
  }

  public static dislikedInteractionToDTO(
    document: DislikedInteractionDocument,
  ): DislikeAthleteResponse {
    return {
      id: document._id,
      userId: document.user,
      toUserId: document.toUser,
      interactionType: document.interactionType,
      createdAt: document.createdAt,
      dislikeEndDate: document.dislikeEndDate,
    }
  }
}
