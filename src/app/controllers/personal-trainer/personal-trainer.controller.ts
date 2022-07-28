/**
 * @module app.controllers.personalTrainers
 */

import { InvalidRequest } from '@app/exceptions/invalid-request-error'
import loggerService from '@app/services/logger/logger-service'
import userService from '@app/services/user/user.service'
import { IncomingRequest } from '@app/types/controller.types'
import { NextFunction, Response } from 'express'
import {
  AddCertificateImagesRequest,
  RegisterPersonalTrainer,
} from './personal-trainer.types'

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

  public async addCertificates(
    req: IncomingRequest<AddCertificateImagesRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (req.files && req.files.length === 0) {
        loggerService.warn(`There is no any certificate images`)
        throw new InvalidRequest('certificateImages.empty')
      }

      const { userId } = req

      const updatedPersonalTrainer = await userService.addCertificateImage(
        userId,
        req.files,
      )

      res.status(200).send(updatedPersonalTrainer)
    } catch (err) {
      next(err)
    }
  }
}

export default new PersonalTrainerController()
