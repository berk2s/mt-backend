/**
 * @module app.controllers.registerController
 */

import interactionService from '@app/services/interaction/interaction.service'
import matchingService from '@app/services/matching/matching.service'
import userService from '@app/services/user/user.service'
import { IncomingRequest } from '@app/types/controller.types'
import { NextFunction, Response } from 'express'
import { UserInfoRequest } from '../user/user-controller.types'
import {
  DislikeAthleteRequest,
  LikeAthleteRequest,
  RegisterAthleteRequest,
  UnlinkMatchingRequest,
  UpdateAthleteRequest,
} from './athlete-controller.types'

/**
 * Athlete Controller
 * @class
 * @alias app.controller.athleteController.AthleteController
 */
class AthleteController {
  public readonly ENDPOINT: string = '/users/athletes'

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

  /**
   * Handles get user info request
   */
  public async getUserInfo(
    req: IncomingRequest<UserInfoRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req
      const user = await userService.getAthleteById(userId)

      return res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Handles update athlete request
   */
  public async updateAthlete(
    req: IncomingRequest<UpdateAthleteRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req

      const athlete = await userService.updateAthlete(userId, req.bodyDto)

      res.status(200).json(athlete)
    } catch (err) {
      next(err)
    }
  }
}

export default new AthleteController()
