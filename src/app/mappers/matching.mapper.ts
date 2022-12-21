/**
 * @module app.mappers
 */

import { MatchingDocument } from '@app/model/matching/Matching'
import { MatchingResponse } from '@app/types/response.types'

export abstract class MatchingMapper {
  public static matchingToDTO(document: MatchingDocument): MatchingResponse {
    return {
      id: document._id,
      interactedUserId: document.interactedUser,
      interactingUserId: document.interactingUser,
      status: document.status,
      chatId: document.chat,
      createdAt: document.createdAt,
    }
  }
}
