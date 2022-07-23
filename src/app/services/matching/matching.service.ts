/**
 * @module app.services.interaction
 */

import { DocumentExists } from '@app/exceptions/document-exists-error'
import { MatchingMapper } from '@app/mappers/matching.mapper'
import { Matching, MatchingModel } from '@app/model/matching/Matching'
import { MatchingResponse } from '@app/types/response.types'
import loggerService from '../logger/logger-service'

/**
 * Matching service
 * @class
 * @alias app.services.matching.MatchingService
 */
class MatchingService {
  private matching: MatchingModel

  constructor() {
    this.matching = Matching
  }

  public async match(
    interactedAthleteId: string,
    interactingAthleteId: string,
  ): Promise<MatchingResponse> {
    const alreadyMatched = this.checkActiveMathces(
      interactedAthleteId,
      interactingAthleteId,
    )

    if (alreadyMatched) {
      loggerService.warn(
        `Athletes are already matched [interactedAthleteId: ${interactedAthleteId}, interactingAthleteId: ${interactingAthleteId}]`,
      )
      throw new DocumentExists('matching.exists')
    }

    const matching = new Matching({
      interactedAthleteId: interactedAthleteId,
      interactingAthleteId: interactingAthleteId,
    })
    await matching.save()

    loggerService.info(
      `Athletes are succesfully matched [interactedAthleteId: ${interactedAthleteId}, interactingAthleteId: ${interactingAthleteId}]`,
    )

    return Promise.resolve(MatchingMapper.matchingToDTO(matching))
  }

  private async checkActiveMathces(
    firstUserId: string,
    secondUserId: string,
  ): Promise<boolean> {
    const matching = await this.matching.findOne({
      $or: [
        {
          interactedUser: firstUserId,
          interactigAthleteId: secondUserId,
          status: 'ACTIVE',
        },
        {
          interactedUser: secondUserId,
          interactigAthleteId: firstUserId,
          status: 'ACTIVE',
        },
      ],
    })

    return matching ? true : false
  }
}

export default new MatchingService()
