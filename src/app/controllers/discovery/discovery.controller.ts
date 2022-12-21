/**
 * @module app.controllers.discovery
 */

import discoveryService from '@app/services/discovery/discovery.service'
import { IncomingRequest } from '@app/types/controller.types'
import { NextFunction, Response } from 'express'
import { DiscoveryRequest } from './discovery-controller.types'

/**
 * Discovery Controller
 * @class
 * @alias app.controllers.discovery.DiscoveryController
 */
class DiscoveryController {
  public readonly ENDPOINT: string = '/discovery'
  /**
   * Handles discover request
   * Returns athletes that mathcs the criterias
   */
  public async discover(
    req: IncomingRequest<DiscoveryRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = req.query
      const { userId } = req

      const discoveryList = await discoveryService.discover(query, userId)

      return res.status(200).json(discoveryList)
    } catch (err) {
      next(err)
    }
  }
}

export default new DiscoveryController()
