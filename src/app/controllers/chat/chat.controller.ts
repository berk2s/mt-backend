/**
 * @module app.controllers.chat
 */

import chatService from '@app/services/chat/chat.service'
import { IncomingRequest } from '@app/types/controller.types'
import { NextFunction, Response } from 'express'
import {
  ChatMessagesRequest,
  MyChatsRequest,
  SendMessageRequest,
} from './chat-controller.types'

/**
 * Chat controller
 * @class
 * @alias app.controllers.ChatController
 */
class ChatController {
  public readonly ENDPOINT: string = '/chats'

  /**
   * Sends message to the chat
   */
  public async sendMessage(
    req: IncomingRequest<SendMessageRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { chatId } = req.params
      const { content } = req.bodyDto

      const message = await chatService.sendMessage(req.userId, chatId, content)

      return res.status(200).json(message)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Handles list my chat requests
   */
  public async myChats(
    req: IncomingRequest<MyChatsRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req

      const chats = await chatService.getChatsByUserId(userId)

      return res.status(200).json(chats)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Handles get chat messages request
   */
  public async chatMessages(
    req: IncomingRequest<ChatMessagesRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { chatId } = req.params
      const { userId } = req

      const messages = await chatService.getMessagesByChatId(chatId, userId)

      return res.status(200).json(messages)
    } catch (err) {
      next(err)
    }
  }
}

export default new ChatController()
