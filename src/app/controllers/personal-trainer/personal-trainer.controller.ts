/**
 * @module app.controllers.personalTrainers
 */

import userService from '@app/services/user/user.service'
import { IncomingRequest } from '@app/types/controller.types'
import { NextFunction, Response } from 'express'
import { RegisterPersonalTrainer } from './personal-trainer.types'

/**
 * Personal Trainer Controller
 * @class
 * @alias app.controllers.personalTrainers.PersonalTrainerController
 */
class PersonalTrainerController {
  public readonly ENDPOINT: string = '/users/personal-trainers'

  /**
   * Handles register personal trainer request
   */
  public async registerPersonalTrainer(
    req: IncomingRequest<RegisterPersonalTrainer>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const tokens = await userService.registerPersonalTrainer(req.bodyDto)

      return res.status(201).json(tokens)
    } catch (err) {
      next(err)
    }
  }
}

export default new PersonalTrainerController()
