import '@app/config/env.config'
import starter from '@app/app'
import mongoConnection from '@app/config/mongo/mongo.config'
import loggerService from '@app/services/logger/logger-service'
import socketConnection from '@app/config/socket/socket.connection'

/**
 * Firstly, tries connect to the MongoDB
 * Then, starts application with defined port in the env file
 */
mongoConnection.connect(() => {
  starter.app.listen(process.env.PORT, () => {
    loggerService.info('Server is available! at ' + process.env.PORT)
  })
})

process.on('uncaughtException', (err) => {
  try {
    loggerService.warn('Uncaught exception: ', err)
  } catch (err) {
    loggerService.warn('Uncaught exception: ', err)
  }
})
