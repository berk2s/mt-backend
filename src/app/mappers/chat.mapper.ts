/**
 * @module app.mappers
 */

import { ChatDocument } from '@app/model/chat/Chat'
import { MessageDocument } from '@app/model/chat/Message'
import {
  ChatResponse,
  MessageResponse,
  MyChatsResponse,
  SendMessageResponse,
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

  public static messageToDTO(document: ChatDocument): SendMessageResponse {
    return {
      chatId: document._id,
      messages: document.messages.map((message) => {
        return {
          id: message._id,
          content: message.content,
          senderId: message.sender,
          createdAt: document.createdAt,
        }
      }),
      createdAt: document.createdAt,
    }
  }

  public static chatWithParticipantsToDTO(
    document: ChatDocument[],
  ): MyChatsResponse[] {
    return document.map((chat) => {
      return {
        chatId: chat._id,
        matchingId: chat.matching,
        participants: chat.participants,
        status: chat.status,
        createdAt: chat.createdAt,
      }
    })
  }

  public static messagesToDTO(documents: MessageDocument[]): MessageResponse[] {
    return documents.map((document) => {
      return {
        id: document._id,
        senderId: document.sender,
        chatId: document.chat,
        content: document.content,
        createdAt: document.createdAt,
      }
    })
  }
}
