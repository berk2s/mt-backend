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

  public static gymListToDto(document: GymDocument[]): GymResponse[] {
    return document.map((i) => {
      return {
        id: i._id,
        name: i.name,
      }
    })
  }
}
