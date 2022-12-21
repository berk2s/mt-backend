/**
 * @module app.services.chat
 */

import { DocumentExists } from '@app/exceptions/document-exists-error'
import { DocumentNotFound } from '@app/exceptions/document-not-found-error'
import { InvalidRequest } from '@app/exceptions/invalid-request-error'
import { UnauthorizedError } from '@app/exceptions/unauthorized-error'
import { ChatMapper } from '@app/mappers/chat.mapper'
import { Chat, ChatModel } from '@app/model/chat/Chat'
import { Message, MessageModel } from '@app/model/chat/Message'
import {
  ChatResponse,
  MessageResponse,
  MyChatsResponse,
  SendMessageResponse,
} from '@app/types/response.types'
import { ObjectIdUtility } from '@app/utilities/objectid-utility'
import { Types } from 'mongoose'
import { io } from 'server'
import loggerService from '../logger/logger-service'
import matchingService from '../matching/matching.service'
import userService from '../user/user.service'

/**
 * Chat Service
 * @class
 * @alias app.services.chat
 */
class ChatService {
  private chat: ChatModel
  private message: MessageModel

  constructor() {
    this.chat = Chat
    this.message = Message
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
  ): Promise<SendMessageResponse> {
    await this.checkObjectIds(senderId, chatId)

    const chat = await this.getChatById(chatId)

    if (chat.status === 'CLOSED') {
      loggerService.warn(
        `User tried to send a message to the closed chat [userId: ${senderId}, chatId: ${chatId}]`,
      )
      throw new DocumentNotFound('chat.closed')
    }

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

    const chatMessages = await chat.populate(
      'messages',
      '_id content sender createdAt',
      null,
      {
        sort: {
          createdAt: 1,
        },
      },
    )

    loggerService.info(
      `A message sent to the chat by a user [senderId: ${senderId}, chatId: ${chatId}]`,
    )

    return Promise.resolve(ChatMapper.messageToDTO(chatMessages))
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

  /**
   * Gets chat by id
   */
  public async getChatsByUserId(userId: string): Promise<MyChatsResponse[]> {
    await this.checkUserExists(userId)

    const chat = await this.chat.aggregate([
      {
        $match: {
          participants: {
            $in: [new Types.ObjectId(userId)],
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: '_id',
          as: 'participants',
        },
      },
      {
        $unwind: {
          path: '$participants',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: {
            id: '$_id',
            status: '$status',
            matching: '$matching',
            createdAt: '$createdAt',
          },
          participants: {
            $addToSet: '$participants',
          },
        },
      },
      {
        $project: {
          _id: '$_id.id',
          status: '$_id.status',
          matching: '$_id.matching',
          participants: {
            _id: 1,
            fullName: 1,
            imageUrl: 1,
          },
          createdAt: '$_id.createdAt',
        },
      },
    ])

    if (!chat) {
      loggerService.warn(
        `Chat with the given user id doesn't exists [userId: ${userId}]`,
      )
      throw new DocumentNotFound('chat.notFound')
    }

    return Promise.resolve(ChatMapper.chatWithParticipantsToDTO(chat))
  }

  /**
   * Gets chat messages
   */
  public async getMessagesByChatId(
    chatId: string,
    userId: string,
  ): Promise<MessageResponse[]> {
    await this.checkChatId(chatId)
    await this.checkUserExists(userId)
    await this.checkChatBelongsToUser(chatId, userId)

    const messages = await this.message.find({
      chat: chatId,
    })

    return Promise.resolve(ChatMapper.messagesToDTO(messages))
  }

  /**
   * Assigns a matching
   */
  public async assignMatching(chatId: string, matchingId: string) {
    await this.checkMatching(matchingId)

    const chat = await this.chat.findById(chatId)

    chat.matching = matchingId
    chat.save()

    loggerService.info(
      `A matching is assigned to a chat [matchingId: ${matchingId}, chatId: ${chatId}]`,
    )
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

  private async checkUserExists(userId: string) {
    const doesUserExists = await userService.existsById(userId)

    if (!doesUserExists) {
      loggerService.warn(
        `User with the given id doesn't exists [userId: ${userId}]`,
      )
      throw new DocumentNotFound('user.notFound')
    }
  }

  private async checkChatBelongsToUser(chatId: string, userId: string) {
    const chat = await this.chat.find({
      _id: chatId,
      participants: {
        $in: [new Types.ObjectId(userId)],
      },
    })

    if (!chat || chat.length === 0) {
      loggerService.warn(
        `The User is not participant of the chat [chatId: ${chatId}, userId: ${userId}]`,
      )
      throw new UnauthorizedError('user.notParticipant')
    }
  }

  private async checkMatching(matchingId: string) {
    const matching = matchingService.existsById(matchingId)

    if (!matching) {
      loggerService.warn(
        `Matching with the given id doesn't eixsts [matchingId: ${matchingId}]`,
      )
      throw new DocumentNotFound('matching.notFound')
    }
  }
}

export default new ChatService()
