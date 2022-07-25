import '@app/config/env.config'
import starter from '@app/app'
import mongoConnection from '@app/config/mongo/mongo.config'
import loggerService from '@app/services/logger/logger-service'
import { createServer } from 'http'
import { Server } from 'socket.io'
import socketTokenVerify from '@app/middlewares/socket-token.middleware'
import chatService from '@app/services/chat/chat.service'

/**
 * Firstly, tries connect to the MongoDB
 * Then, starts application with defined port in the env file
 */
mongoConnection.connect(() => {})

process.on('uncaughtException', (err) => {
  try {
    loggerService.warn('Uncaught exception: ', err)
  } catch (err) {
    loggerService.warn('Uncaught exception: ', err)
  }
})

const httpServer = createServer(starter.app)

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
  maxHttpBufferSize: 1e8,
})

io.on('connection', (socket) => {
  loggerService.info(`An socket connection established. [id: ${socket.id}]`)

  socket.on('join', (data) => {
    const { chatId } = data

    socket.join(chatId)
  })

  socket.on('chat', async (data) => {
    const { from, to, content } = data

    const messageResponse = await chatService.sendMessage(from, to, content)

    io.to(to).emit('chat', {
      chat: messageResponse,
      from: from,
    })
  })

  socket.emit('test', { data: true })
})

io.use(socketTokenVerify)

httpServer.listen(8081)

export { io }
