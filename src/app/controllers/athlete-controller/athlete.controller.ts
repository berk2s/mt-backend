/**
 * @module app.controllers.registerController
 */

import userService from '@app/services/user/user.service'
import { IncomingRequest } from '@app/types/controller.types'
import { NextFunction, Response } from 'express'
import { RegisterAthleteRequest } from './athlete-controller.types'

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
}

export default new AthleteController()
