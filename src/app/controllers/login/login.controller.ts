/**
 * @module app.controllers.login
 */

import loginService from '@app/services/login/login.service'
import { IncomingRequest } from '@app/types/controller.types'
import { NextFunction, Response } from 'express'
import { LoginRequest } from './login-controller.types'

/**
 * Login Controller
 * @class
 * @alias app.controllers.login.LoginController
 */
class LoginController {
  public readonly ENDPOINT: string = '/authenticate'
  /**
   * Handles login request and passes to corresponding service
   */
  public async login(
    req: IncomingRequest<LoginRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const loginResponse = await loginService.login(req.bodyDto)

      return res.status(200).json(loginResponse)
    } catch (err) {
      next(err)
    }
  }
}

export default new LoginController()
