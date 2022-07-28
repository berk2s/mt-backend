/**
 * @module app.controllers.personalTrainers
 */

import { InvalidRequest } from '@app/exceptions/invalid-request-error'
import loggerService from '@app/services/logger/logger-service'
import subscriptionPackageService from '@app/services/subscription/subscription-package.service'
import userService from '@app/services/user/user.service'
import { IncomingRequest } from '@app/types/controller.types'
import { PTResponse } from '@app/types/response.types'
import { NextFunction, Response, Request, RequestHandler } from 'express'
import {
  AddCertificateImagesRequest,
  CreatePTPackageRequest,
  PTInfoRequest,
  PTListRequest,
  RegisterPersonalTrainer,
  UpdatePTPackageRequest,
  UpdatePTRequest,
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

  /**
   * Handles add certificate image request
   */
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

  /**
   * Handles create personal trainer package request
   */
  public async createPTPackage(
    req: IncomingRequest<CreatePTPackageRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req

      const ptPackage = await subscriptionPackageService.createPTPackage(
        userId,
        req.bodyDto,
      )

      return res.status(201).json(ptPackage)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Handles get PT info rqeuest
   */
  public async getPTInfo(
    req: IncomingRequest<PTInfoRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req

      const ptInfo = await userService.getPTInfo(userId)

      return res.status(200).json(ptInfo)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Handles all personal trainers request
   */
  public async getPersonalTrainers(
    req: IncomingRequest<PTListRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req
      const personalTrainers = await userService.getPersonalTrainers(userId)

      return res.status(200).json(personalTrainers)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Handles update personal trainer package request
   */
  public async updatePTPackage(
    req: IncomingRequest<UpdatePTPackageRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { packageId } = req.params

      const updatedPackage = await subscriptionPackageService.updatePTPackage(
        packageId,
        req.bodyDto,
      )

      return res.status(200).json(updatedPackage)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Handles delete personal trainer package request
   */
  public async deletePTPackage(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { packageId } = req.params

      await subscriptionPackageService.deletePTPackage(packageId)

      return res.status(200).json()
    } catch (err) {
      next(err)
    }
  }

  /**
   * Handles update personal trainer request
   */
  public async updatePTProfile(
    req: IncomingRequest<UpdatePTRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req

      const personalTrainer = await userService.updatePT(userId, req.bodyDto)

      return res.status(200).json(personalTrainer)
    } catch (err) {
      next(err)
    }
  }
}

export default new PersonalTrainerController()
