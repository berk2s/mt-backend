/**
 * @module app.module.gym
 */

import { GymMapper } from '@app/mappers/gym.mapper'
import { Gym, GymModel } from '@app/model/gym/Gym'
import { GymResponse } from '@app/types/response.types'
import loggerService from '../logger/logger-service'

/**
 * GYM Service
 * @class
 * @alias app.module.gym.GymService
 */
class GymService {
  private gym: GymModel

  constructor() {
    this.gym = Gym
  }

  /**
   * Creates a GYM
   */
  public async create(gymName: string): Promise<GymResponse> {
    const gym = new Gym({
      name: gymName,
    })
    await gym.save()

    loggerService.info(`A Gym created [gymId: ${gym.id}]`)

    return Promise.resolve(GymMapper.gymToDto(gym))
  }

  /**
   * Gets by gym id
   */
  public async getById(gymId: string): Promise<GymResponse> {
    const gym = await this.gym.findById(gymId)

    if (!gym) return null

    return Promise.resolve(GymMapper.gymToDto(gym))
  }
}

export default new GymService()
