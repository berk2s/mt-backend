/**
 * @module app.controllers
 */

import { InvalidRequest } from '@app/exceptions/invalid-request-error'
import loggerService from '@app/services/logger/logger-service'
import userService from '@app/services/user/user.service'
import { IncomingRequest } from '@app/types/controller.types'
import { NextFunction } from 'express'
import { Request, Response } from 'express'
import {
  UpdateGymRequest,
  UpdateProfilePhotoRequest,
  UserInfoRequest,
} from './user-controller.types'
/**
 * User Controller
 * @class
 * @alias app.controller.userController.UserController
 */
class UserController {
  public readonly ENDPOINT: string = '/users'

  /**
   * Handles update profile photo request
   */
  public async updateProfilePhoto(
    req: IncomingRequest<UpdateProfilePhotoRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.file) {
        loggerService.warn("Profile image doesn't exists")
        throw new InvalidRequest('profileImage.empty')
      }

      const { userId } = req.params

      const updatedUser = await userService.updateProfilePhoto(
        userId,
        req.file.buffer,
      )

      res.status(200).send(updatedUser)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Handles update gym preference request
   */
  public async updateGym(
    req: IncomingRequest<UpdateGymRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { gymId } = req.params
      const { userId } = req

      const updatedUser = await userService.updateGym(userId, gymId)

      return res.status(200).json(updatedUser)
    } catch (err) {
      next(err)
    }
  }
}

export default new UserController()
