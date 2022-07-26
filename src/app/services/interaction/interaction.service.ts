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
import { MatchingDocument } from '@app/model/matching/Matching'
import { AthleteUser } from '@app/model/user/Athlete'
import { Model } from 'mongoose'
import loggerService from '../logger/logger-service'
import matchingService from '../matching/matching.service'
import userService from '../user/user.service'

/**
 * Interaction service
 * @class
 * @alias app.services.interaction.InteractionService
 */
class InteractionService {
  private baseInteraction: BaseInteractionModel
  private athleteModel: Model<any>
  private likedInteraction: Model<any>

  constructor() {
    this.baseInteraction = BaseInteraction
    this.athleteModel = AthleteUser
    this.likedInteraction = LikedInteraction
  }

  /**
   * Likes the Athlete
   */
  public async likeAthlete(
    userId: string,
    likedUserId: string,
  ): Promise<LikeAthleteResponse> {
    const likedAthlete = await this.getAthlete(likedUserId)

    await this.checkDocumentExists(userId, likedUserId, 'LIKED')

    const likedInteraction = new LikedInteraction({
      user: userId,
      toUser: likedUserId,
    })

    const areMatching = await this.checkMatching(userId, likedUserId)

    if (areMatching) {
      const createdMatching = await matchingService.match(likedUserId, userId)
      likedInteraction.matching = createdMatching.id
    }

    await likedInteraction.save()

    if (likedAthlete.interactedBy) {
      likedAthlete.interactedBy = [...likedAthlete.interactedBy, userId]
      await likedAthlete.save()
    }

    loggerService.info(
      `An athlete had send liked interaction to another athlete [userId: ${userId}, toUserId: ${likedUserId}]`,
    )

    const populated = await likedInteraction.populate<{
      matching: MatchingDocument
    }>('matching')

    return Promise.resolve(InteractionMapper.likedInteractionToDTO(populated))
  }

  /**
   * Disliked the User
   */
  public async dislikeAthlete(
    userId: string,
    dislikedUserId: string,
  ): Promise<DislikeAthleteResponse> {
    const dislikedAthlete = await this.getAthlete(dislikedUserId)

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

    if (Array.isArray(dislikedAthlete.interactedBy)) {
      dislikedAthlete.interactedBy = [...dislikedAthlete.interactedBy, userId]
      await dislikedAthlete.save()
    }

    loggerService.info(
      `An athlete had send disliked interaction to another athlete [userId: ${userId}, toUserId: ${dislikedUserId}]`,
    )

    return Promise.resolve(
      InteractionMapper.dislikedInteractionToDTO(dislikedInteraction),
    )
  }

  /**
   * Closes by matching id
   */
  public async closeByMatchingId(matchingId: string) {
    const likedInteraction = await this.likedInteraction.findOne({
      mathcing: matchingId,
    })

    if (!likedInteraction) {
      loggerService.warn(
        `Interaction with the given matching id doesn't exists [matchingId: ${matchingId}]`,
      )
      throw new DocumentNotFound('interaction.notFound')
    }

    likedInteraction.status = 'CLOSED'
    await likedInteraction.save()

    loggerService.info(
      `Liked interaction closed [interactionId: ${likedInteraction._id}, matchingId: ${matchingId}]`,
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

  private async checkMatching(
    userId: string,
    likedUserId: string,
  ): Promise<boolean> {
    const isInteractedBefore = await this.baseInteraction.exists({
      user: likedUserId,
      toUser: userId,
      interactionType: 'LIKED',
    })

    return Promise.resolve(isInteractedBefore ? true : false)
  }

  private async getUsers(interactingUserId: string, interactedUserId: string) {
    const interactedUser = await this.athleteModel.findById(interactingUserId)
    const interactingUser = await this.athleteModel.findById(interactedUserId)

    if (!interactedUser) this.generateUserNotFoundError(interactingUserId)

    if (!interactingUser) this.generateUserNotFoundError(interactedUserId)

    return [interactedUser, interactingUser]
  }

  private async getAthlete(likedAthleteId: string) {
    const likedAthlete = await this.athleteModel.findById(likedAthleteId)

    if (!likedAthlete) this.generateUserNotFoundError(likedAthleteId)

    return likedAthlete
  }

  private generateUserNotFoundError(userId: string) {
    loggerService.warn(
      `User with the given id doesn't exists [userId: ${userId}]`,
    )
    throw new DocumentNotFound('user.notFound')
  }
}

export default new InteractionService()
