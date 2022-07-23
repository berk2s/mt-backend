/**
 * @module app.controllers.registerController
 */

import interactionService from '@app/services/interaction/interaction.service'
import matchingService from '@app/services/matching/matching.service'
import userService from '@app/services/user/user.service'
import { IncomingRequest } from '@app/types/controller.types'
import { NextFunction, Response } from 'express'
import {
  DislikeAthleteRequest,
  LikeAthleteRequest,
  RegisterAthleteRequest,
  UnlinkMatchingRequest,
} from './athlete-controller.types'

/**
 * Athlete Controller
 * @class
 * @alias app.controller.athleteController.AthleteController
 */
class AthleteController {
  public readonly ENDPOINT: string = '/user/athlete'

  /**
   * Handles register athlete post request
   */
  public async registerUser(
    req: IncomingRequest<RegisterAthleteRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const registeredUser = await userService.registerAthlete(req.bodyDto)
      res.status(201).json(registeredUser)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Handles like athlete request
   */
  public async likeAthlete(
    req: IncomingRequest<LikeAthleteRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req

      const likedResponse = await interactionService.likeAthlete(
        userId,
        req.bodyDto.likedUserId,
      )

      res.status(200).send(likedResponse)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Handles dislike athlete request
   */
  public async dislikeAthlete(
    req: IncomingRequest<DislikeAthleteRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req

      const dislikedResponse = await interactionService.dislikeAthlete(
        userId,
        req.bodyDto.dislikedUserId,
      )

      res.status(200).send(dislikedResponse)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Unlinks the matched matching
   */
  public async unlinkMatching(
    req: IncomingRequest<UnlinkMatchingRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.userId
      const { matchingId } = req.params

      const unlinkedMatching = await matchingService.unlink(userId, matchingId)

      res.status(200).send(unlinkedMatching)
    } catch (err) {
      next(err)
    }
  }
}

export default new AthleteController()
