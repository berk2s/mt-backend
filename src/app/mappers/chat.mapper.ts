/**
 * @module app.mappers
 */

import { ChatDocument } from '@app/model/chat/Chat'
import { MessageDocument } from '@app/model/chat/Message'
import {
  ChatResponse,
  MessageResponse,
  MyChatsResponse,
} from '@app/types/response.types'

export abstract class ChatMapper {
  public static chatToDTO(document: ChatDocument): ChatResponse {
    return {
      id: document._id,
      participantIds: document.participants,
      messageIds: document.messages,
      status: document.status,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    }
  }

  public static messageToDTO(document: MessageDocument): MessageResponse {
    return {
      id: document._id,
      senderId: document.sender,
      chatId: document.chat,
      content: document.content,
      createdAt: document.createdAt,
    }
  }

  public static chatWithParticipantsToDTO(
    document: ChatDocument[],
  ): MyChatsResponse[] {
    return document.map((chat) => {
      return {
        chatId: chat._id,
        participants: chat.participants,
        status: chat.status,
        createdAt: chat.createdAt,
      }
    })
  }
}
