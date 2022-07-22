/**
 * @module app.controllers.registerController
 */

import interactionService from '@app/services/interaction/interaction.service'
import userService from '@app/services/user/user.service'
import { IncomingRequest } from '@app/types/controller.types'
import { NextFunction, Response } from 'express'
import {
  LikeAthleteRequest,
  RegisterAthleteRequest,
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
}

export default new AthleteController()
