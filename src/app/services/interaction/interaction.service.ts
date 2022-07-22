/**
 * @module app.services.interaction
 */

import { LikeAthleteResponse } from '@app/controllers/athlete/athlete-controller.types'
import { DocumentExists } from '@app/exceptions/document-exists-error'
import { DocumentNotFound } from '@app/exceptions/document-not-found-error'
import { InteractionMapper } from '@app/mappers/interaction.mapper'
import {
  BaseInteraction,
  BaseInteractionModel,
} from '@app/model/interaction/BaseInteraction'
import { LikedInteraction } from '@app/model/interaction/LikedInteraction'
import loggerService from '../logger/logger-service'
import userService from '../user/user.service'

/**
 * Interaction service
 * @class
 * @alias app.services.interaction.InteractionService
 */
class InteractionService {
  private baseInteractio: BaseInteractionModel

  constructor() {
    this.baseInteractio = BaseInteraction
  }

  /**
   * Likes the Athlete
   */
  public async likeAthlete(
    userId: string,
    likedUserId: string,
  ): Promise<LikeAthleteResponse> {
    if (
      !(await userService.existsById(userId)) ||
      !(await userService.existsById(likedUserId))
    ) {
      loggerService.warn(
        `User with given id doesn't eixsts [userId: ${userId}]`,
      )
      throw new DocumentNotFound('user.notFound')
    }

    const isLikedBefore = await this.baseInteractio.exists({
      user: userId,
      toUser: likedUserId,
      interactionType: 'LIKED',
    })

    if (isLikedBefore) {
      loggerService.warn(
        `The Athlete already liked this athlete [userId: ${userId}, toUserId: ${likedUserId}]`,
      )
      throw new DocumentExists('liked.before')
    }

    const likedInteraction = new LikedInteraction({
      user: userId,
      toUser: likedUserId,
    })

    likedInteraction.save()

    loggerService.info(
      `An athlete had send liked interaction to another athlete [userId: ${userId}, toUserId: ${likedUserId}]`,
    )

    return Promise.resolve(
      InteractionMapper.likedInteractionToDTO(likedInteraction),
    )
  }
}

export default new InteractionService()
