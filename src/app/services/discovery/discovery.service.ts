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
  public async discover(rawQuery: any): Promise<AthleteResponse[]> {
    const query = await queryParserService.parse(rawQuery)

    const athletes = await this.athleteModel.aggregate([
      {
        $lookup: {
          from: 'interactions',
          localField: '_id',
          foreignField: 'user',
          as: 'interactions',
        },
      },
      {
        $unwind: {
          path: '$interactions',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            id: '$_id',
            fullName: '$fullName',
            birthday: '$birthday',
            sex: '$sex',
            languages: '$languages',
            workoutDays: '$workoutDays',
            gym: '$gym',
            trainingExperience: '$trainingExperience',
            trainingDays: '$trainingDays',
          },
          interaction: {
            $addToSet: '$interactions',
          },
        },
      },
      {
        $match: {
          'interaction.user': {
            $ne: [new Types.ObjectId('62ddb210f0c9c615f3c43c2e')],
          },
          'interaction.status': {
            $ne: ['ACTIVE', null],
          },
        },
      },
      {
        $project: {
          _id: '$_id.id',
          fullName: '$_id.fullName',
          birthday: '$_id.birthday',
          sex: '$_id.sex',
          languages: '$_id.languages',
          workoutDays: '$_id.workoutDays',
          gym: '$_id.gym',
          trainingExperience: '$_id.trainingExperience',
          trainingDays: '$_id.trainingDays',
        },
      },
      {
        $match: query.filter,
      },
      {
        $limit: 2,
      },
    ])

    return Promise.resolve(UserMapper.athletesToDTO(athletes))
  }
}

export default new DiscoveryService()
