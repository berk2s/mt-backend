/**
 * @module app.controllers
 */

import { Request, Response } from 'express'

/**
 * Health controller
 * @class
 * @alias app.controllers.healthController
 */
class HealthController {
  /**
   * Execution endpoint
   */
  public readonly ENDPOINT: string = '/health'

  /**
   * Responses application's status
   */
  public health(req: Request, res: Response): void {
    res.status(200).send({
      status: 'OK',
    })
  }
}

export default new HealthController()
