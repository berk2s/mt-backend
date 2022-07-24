/**
 * @module app.services.chat
 */

import { DocumentExists } from '@app/exceptions/document-exists-error'
import { DocumentNotFound } from '@app/exceptions/document-not-found-error'
import { InvalidRequest } from '@app/exceptions/invalid-request-error'
import { ChatMapper } from '@app/mappers/chat.mapper'
import { Chat, ChatModel } from '@app/model/chat/Chat'
import { Message } from '@app/model/chat/Message'
import { ChatResponse, MessageResponse } from '@app/types/response.types'
import { ObjectIdUtility } from '@app/utilities/objectid-utility'
import loggerService from '../logger/logger-service'
import userService from '../user/user.service'

/**
 * Chat Service
 * @class
 * @alias app.services.chat
 */
class ChatService {
  private chat: ChatModel

  constructor() {
    this.chat = Chat
  }

  /**
   * Creates a chat room
   */
  public async create(participantIds: string[]): Promise<ChatResponse> {
    await this.checkParticipantIds(participantIds)

    if (await this.isCreatedBefore(participantIds)) {
      loggerService.info(
        `Chat already exists between same participants [participants: ${participantIds}]`,
      )
      throw new DocumentExists('chat.exists')
    }

    const chat = new Chat({
      participants: [...participantIds],
      status: 'ACTIVE',
    })
    await chat.save()

    loggerService.info(
      `Chat created between participants [chatId: ${chat._id}, participants: ${participantIds}]`,
    )

    return Promise.resolve(ChatMapper.chatToDTO(chat))
  }

  /**
   * Sends message to the chat room
   */
  public async sendMessage(
    senderId: string,
    chatId: string,
    content: string,
  ): Promise<MessageResponse> {
    await this.checkObjectIds(senderId, chatId)

    const chat = await this.getChatById(chatId)

    await this.checkParticipantIds([senderId])
    if (!(await this.checkParticipant(chatId, senderId))) {
      loggerService.info(
        `The sender isn't participant of the chat [senderId: ${senderId}, chatId: ${chatId}]`,
      )
      throw new DocumentNotFound('participant.notFound')
    }

    const message = new Message({
      sender: senderId,
      chat: chatId,
      content: content,
    })
    await message.save()

    chat.messages = [...chat.messages, message._id.toString()]
    await chat.save()

    loggerService.info(
      `A message sent to the chat by a user [senderId: ${senderId}, chatId: ${chatId}]`,
    )

    return Promise.resolve(ChatMapper.messageToDTO(message))
  }

  /**
   * Closes the chat room
   */
  public async closeChat(chatId: string): Promise<ChatResponse> {
    const chat = await this.getChatById(chatId)

    chat.status = 'CLOSED'
    chat.save()

    loggerService.info(`The Chat room closed [chatId: ${chatId}]`)

    return Promise.resolve(ChatMapper.chatToDTO(chat))
  }

  private async checkParticipantIds(participantIds: string[]) {
    participantIds.forEach(async (participantId) => {
      const doesUserExists = await userService.existsById(participantId)

      if (!doesUserExists) {
        loggerService.warn(
          `User doesn't exists with given id [userId: ${participantId}`,
        )
        throw new DocumentNotFound('user.notFound')
      }
    })
  }

  private async isCreatedBefore(participantIds: string[]) {
    const chat = await this.chat.findOne({
      participants: [...participantIds],
      status: 'active',
    })

    return chat ? true : false
  }

  private async checkChatId(chatId: string) {
    const doesChatExists = await this.chat.findById(chatId)

    if (!doesChatExists) {
      loggerService.warn(
        `Chat with the given id doesn't exists [chatId: ${chatId}]`,
      )
      throw new DocumentNotFound('chat.notFound')
    }
  }

  private async checkParticipant(chatId: string, participantId: string) {
    const chat = await this.chat.findById(chatId)

    if (!chat) return Promise.resolve(false)

    const filter = chat.participants.filter(
      (i: any) => i.toString() === participantId,
    )

    return Promise.resolve(filter.length > 0 ? true : false)
  }

  private async getChatById(chatId: string) {
    const chat = await this.chat.findById(chatId)

    if (!chat) {
      loggerService.warn(
        `Chat with the given id doesn't exists [chatId: ${chatId}]`,
      )
      throw new DocumentNotFound('chat.notFound')
    }

    return chat
  }

  private async checkObjectIds(...ids: string[]) {
    ids.forEach((id) => {
      if (!ObjectIdUtility.isValid(id)) {
        throw new InvalidRequest('id.invalid')
      }
    })
  }
}

export default new ChatService()
