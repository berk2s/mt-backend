/**
 * @module app.services.discovery
 */

import { UserMapper } from '@app/mappers/user.mapper'
import { AthleteUser } from '@app/model/user/Athlete'
import { AthleteResponse } from '@app/types/response.types'
import { Model, Mongoose, Types } from 'mongoose'
import queryParserService from '../query-parser/query-parser.service'

/**
 * Discovery Service
 * @class
 * @alias app.services.discovery.DiscoveryService
 */
class DiscoveryService {
  private athleteModel: Model<any>

  constructor() {
    this.athleteModel = AthleteUser
  }

  /**
   * Gets athletes for the discovery
   * Results are filtered by given criterias
   */
  public async discover(
    rawQuery: any,
    userId: string,
  ): Promise<AthleteResponse[]> {
    const query = await queryParserService.parse(rawQuery)

    const athletes = await this.athleteModel
      .find({
        interactedBy: {
          $nin: [new Types.ObjectId(userId)],
        },
      })
      .limit(2)

    return Promise.resolve(UserMapper.athletesToDTO(athletes))
  }
}

export default new DiscoveryService()
