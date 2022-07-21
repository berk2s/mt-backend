/**
 * @module app.services.loggerService
 */

import logConfig from '@app/config/log.config'
import winston from 'winston'

/**
 * Logger Service
 *
 * Abstracts logger service behind the scene
 *
 * @alias app.services.loggerService.LoggerService
 */
class LoggerService {
  private logger: winston.Logger

  constructor() {
    this.logger = winston.createLogger(logConfig)
  }

  info(...args: any) {
    this.logger.info(args)
  }

  warn(...args: any) {
    this.logger.warn(args)
  }

  error(...args: any) {
    this.logger.error(args)
  }
}

export default new LoggerService()
