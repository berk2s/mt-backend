/**
 * @module app.services.interaction
 */

import interactionConfig from '@app/config/interaction.config'
import {
  DislikeAthleteResponse,
  LikeAthleteResponse,
} from '@app/controllers/athlete/athlete-controller.types'
import { DocumentExists } from '@app/exceptions/document-exists-error'
import { DocumentNotFound } from '@app/exceptions/document-not-found-error'
import { InteractionMapper } from '@app/mappers/interaction.mapper'
import {
  BaseInteraction,
  BaseInteractionModel,
} from '@app/model/interaction/BaseInteraction'
import { DislikedInteraction } from '@app/model/interaction/DislikedInteraction'
import { LikedInteraction } from '@app/model/interaction/LikedInteraction'
import loggerService from '../logger/logger-service'
import userService from '../user/user.service'

/**
 * Interaction service
 * @class
 * @alias app.services.interaction.InteractionService
 */
class InteractionService {
  private baseInteraction: BaseInteractionModel

  constructor() {
    this.baseInteraction = BaseInteraction
  }

  /**
   * Likes the Athlete
   */
  public async likeAthlete(
    userId: string,
    likedUserId: string,
  ): Promise<LikeAthleteResponse> {
    await this.checkUsersExist(userId, likedUserId)
    await this.checkDocumentExists(userId, likedUserId, 'LIKED')

    const likedInteraction = new LikedInteraction({
      user: userId,
      toUser: likedUserId,
    })

    await likedInteraction.save()

    loggerService.info(
      `An athlete had send liked interaction to another athlete [userId: ${userId}, toUserId: ${likedUserId}]`,
    )

    return Promise.resolve(
      InteractionMapper.likedInteractionToDTO(likedInteraction),
    )
  }

  /**
   * Disliked the User
   */
  public async dislikeAthlete(
    userId: string,
    dislikedUserId: string,
  ): Promise<DislikeAthleteResponse> {
    await this.checkUsersExist(userId, dislikedUserId)
    await this.checkDocumentExists(userId, dislikedUserId, 'DISLIKED')

    const likedInteraction = await this.baseInteraction.findOne({
      user: userId,
      toUser: dislikedUserId,
      interactionType: 'LIKED',
    })

    if (likedInteraction) {
      await likedInteraction.remove()
      loggerService.info(
        `The liked interaction revoked. The Athlete stopped liking the Athlete [userId: ${userId}, toUserId: ${dislikedUserId}]`,
      )
    }

    const { dislikeBlockingPeriod } = interactionConfig
    const currDate = new Date()
    currDate.setSeconds(currDate.getSeconds() + dislikeBlockingPeriod)

    const dislikedInteraction = new DislikedInteraction({
      user: userId,
      toUser: dislikedUserId,
      dislikeEndDate: currDate,
    })

    await dislikedInteraction.save()

    loggerService.info(
      `An athlete had send disliked interaction to another athlete [userId: ${userId}, toUserId: ${dislikedUserId}]`,
    )

    return Promise.resolve(
      InteractionMapper.dislikedInteractionToDTO(dislikedInteraction),
    )
  }

  private async checkUsersExist(
    userId: string,
    interactedUserId: string,
  ): Promise<void> {
    if (!(await userService.existsById(userId))) {
      loggerService.warn(
        `User with given id doesn't eixsts [userId: ${userId}]`,
      )
      throw new DocumentNotFound('user.notFound')
    }

    if (!(await userService.existsById(interactedUserId))) {
      loggerService.warn(
        `User with given id doesn't eixsts [userId: ${interactedUserId}]`,
      )
      throw new DocumentNotFound('user.notFound')
    }
  }

  private async checkDocumentExists(
    userId: string,
    interactedUserId: string,
    interactionType: 'LIKED' | 'DISLIKED',
  ): Promise<void> {
    const isInteractedBefore = await this.baseInteraction.exists({
      user: userId,
      toUser: interactedUserId,
      interactionType: interactionType,
    })

    if (isInteractedBefore) {
      loggerService.warn(
        `The Athlete already liked this athlete [userId: ${userId}, toUserId: ${interactedUserId}]`,
      )
      throw new DocumentExists(`${interactionType.toLowerCase()}.before`)
    }
  }
}

export default new InteractionService()
