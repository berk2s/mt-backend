/**
 * @module app.controllers.registerController
 */

import userService from '@app/services/user/user.service'
import { IncomingRequest } from '@app/types/controller.types'
import { NextFunction, Response } from 'express'
import { RegisterUserRequest } from './register-controller.types'

/**
 * User Register Controller
 * @class
 * @alias app.controller.registerController.RegisterController
 */
class RegisterController {
  public readonly ENDPOINT: string = '/register'

  /**
   * Handles register user post request
   */
  public async registerUser(
    req: IncomingRequest<RegisterUserRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const registeredUser = await userService.register(req.bodyDto)

      res.status(201).json(registeredUser)
    } catch (err) {
      next(err)
    }
  }
}

export default new RegisterController()
