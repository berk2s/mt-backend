/**
 * @moduel app.mappers
 */

import { GymDocument } from '@app/model/gym/Gym'
import { GymResponse } from '@app/types/response.types'

export abstract class GymMapper {
  public static gymToDto(document: GymDocument): GymResponse {
    return {
      id: document._id,
      name: document.name,
    }
  }
}
