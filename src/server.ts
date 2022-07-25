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
  loggerService.info(`An socket connection established. `)

  socket.emit('test', { data: 'came' })
  socket.on('chat', async (socket) => {
    const { to, content } = socket.data
    const from = socket.userId

    await chatService.sendMessage(from, to, content)
  })
})

io.use(socketTokenVerify)

httpServer.listen(8081)

export { io }
