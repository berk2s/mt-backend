/**
 * @module app.controllers.gym
 */

import gymService from '@app/services/gym/gym.service'
import { IncomingRequest } from '@app/types/controller.types'
import { NextFunction, Response, Request } from 'express'
import { CreateGymRequest } from './gym-controller.typs'

/**
 * GYM Controller
 * @class
 * @alias app.controllers.gym
 */

class GymController {
  public readonly ENDPOINT: string = '/gyms'

  /**
   * Handles GYM create request
   */
  public async create(
    req: IncomingRequest<CreateGymRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { gymName } = req.bodyDto
      const gym = await gymService.create(gymName)

      return res.status(201).json(gym)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Handles find all gyms request
   */
  public async gyms(req: Request, res: Response, next: NextFunction) {
    try {
      const gyms = await gymService.findAll()

      return res.status(200).json(gyms)
    } catch (err) {
      next(err)
    }
  }
}

export default new GymController()
